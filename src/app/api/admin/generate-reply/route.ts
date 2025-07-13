/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getAllSeedUserConfigs } from '@/db/services/seedUserService';

// POST - Generate a single AI reply for a discussion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { discussionData, aiConfig, replyIndex = 0, selectedMood = 'supportive', activePersonas = [] } = body;
    
    // Debug: Log the mood being used
    console.log('🎭 Mood selected for reply generation:', selectedMood);
    console.log('🎭 Request body keys:', Object.keys(body));
    
    if (!discussionData) {
      return NextResponse.json(
        { success: false, error: 'Discussion data is required' },
        { status: 400 }
      );
    }
    
    if (!aiConfig || !aiConfig.provider || !aiConfig.apiKey) {
      return NextResponse.json(
        { success: false, error: 'AI configuration with provider and API key is required' },
        { status: 400 }
      );
    }
    
    // Get available seed users
    const allSeedConfigs = await getAllSeedUserConfigs();
    if (allSeedConfigs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No seed user configurations found. Please create seed users first.' },
        { status: 400 }
      );
    }
    
    // Filter seed configs based on activePersonas selection
    let seedConfigs = allSeedConfigs;
    if (activePersonas && activePersonas.length > 0) {
      // Filter by userId (which matches persona template IDs)
      seedConfigs = allSeedConfigs.filter(config => activePersonas.includes(config.userId));
      console.log(`Filtered personas: ${allSeedConfigs.length} total -> ${seedConfigs.length} active personas selected from database`);
      console.log(`Active persona IDs requested:`, activePersonas);
      console.log(`Available seed config user IDs:`, allSeedConfigs.map(c => c.userId));
      
      if (seedConfigs.length === 0) {
        console.warn('No matching seed configs found for active personas. This might mean the personas need to be initialized first.');
        return NextResponse.json(
          { success: false, error: 'Selected personas are not available for reply generation. Please initialize seed users first or select different personas.' },
          { status: 400 }
        );
      }
    } else {
      console.log(`No persona filter applied, using all ${allSeedConfigs.length} available personas`);
    }
    
    try {
      // Generate reply based on provider (support both openrouter and deepseek)
      const reply = (aiConfig.provider === 'deepseek' || aiConfig.provider === 'openrouter')
        ? await generateReplyWithDeepSeek(discussionData, seedConfigs, aiConfig, replyIndex, selectedMood)
        : await generateMockReply(discussionData, seedConfigs, replyIndex, selectedMood);
      
      return NextResponse.json({
        success: true,
        data: reply,
        message: 'Successfully generated AI reply'
      });
    } catch (aiError) {
      throw aiError;
    }
  } catch (error) {
    console.error('Error generating reply:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate reply: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// Get mood-specific instructions
function getMoodInstructions(mood: string) {
  const moodMap = {
    'supportive': 'Be encouraging and uplifting. Share how the topic resonates positively with your experience. Use warm, affirming language.',
    'questioning': 'Be curious and analytical. Ask thoughtful questions or express genuine wonder about the topic. Share your confusion or desire to understand better.',
    'excited': 'Be enthusiastic and energetic! Share your excitement or how the topic amazes you. Use exclamation points and energetic language.',
    'wise': 'Be calm and insightful. Share deeper understanding or gentle guidance. Use thoughtful, measured language.',
    'concerned': 'Express worry or caution about the topic. Share your concerns or hesitations. Use careful, protective language.',
    'empathetic': 'Be understanding and caring. Share how you relate to others\' experiences. Use compassionate, connecting language.'
  };
  
  return moodMap[mood as keyof typeof moodMap] || moodMap['supportive'];
}

// Get detailed personality information for each user
function getPersonalityDetails(user: any) {
  const personalityMap = {
    'AstroMaven': {
      personality: 'Professional astrologer with 20+ years experience, warm but authoritative',
      emojis: '✨ 🔮 ⭐',
      background: 'Has a private practice in LA, studied under renowned astrologers, sees patterns others miss',
      replyStyle: 'Usually types properly but sometimes gets excited and forgets punctuation. Shares client insights (anonymously), references classical astrology'
    },
    'MoonChild92': {
      personality: 'Sweet college student who just discovered astrology, eager to learn and very grateful',
      emojis: '🌙 🥺 💕 ✨',
      background: 'College student studying psychology, new to astrology, loves the emotional/spiritual aspects',
      replyStyle: 'types in lowercase a lot, uses lots of "omg" and "wait", admits not knowing much, shares how astrology helps with anxiety'
    },
    'ConfusedSarah': {
      personality: 'Very confused newbie who discovered astrology through TikTok, asks basic questions',
      emojis: '😅 🤷‍♀️ 💭',
      background: 'Found astrology on TikTok, thinks Mercury retrograde means her phone will break, mixes up signs and houses',
      replyStyle: 'types quickly with lots of typos, asks really basic questions like "wait is scorpio a water sign??", shares wrong TikTok facts'
    },
    'WorkingMom47': {
      personality: 'Busy working mom who reads horoscopes during lunch break, practical but interested',
      emojis: '☕ 💼 🏃‍♀️',
      background: 'Single mom in Phoenix, reads daily horoscopes in between meetings, wants astrology to help with parenting',
      replyStyle: 'Quick comments between work, no time for perfect grammar, relates everything to kids or work stress, uses periods for emphasis...'
    },
    'BrokeInCollege': {
      personality: 'Gen Z college freshman who knows zodiac signs from memes, casual and funny',
      emojis: '😂 💸 📱',
      background: 'College freshman who learned astrology from Instagram memes, thinks astrology is "lowkey accurate fr"',
      replyStyle: 'no caps ever, uses "fr", "lowkey", "ngl", makes meme references, relates everything to being broke and college chaos'
    },
    'CrystalKaren': {
      personality: 'Spiritual but confused, mixes astrology with crystals and sage, thinks everything is magic',
      emojis: '🔮 🌸 ✨',
      background: 'Lives in Austin, goes to crystal shops, burns sage for everything, thinks astrology and tarot are the same',
      replyStyle: 'overuses ellipses... mentions crystals in every reply... suggests cleansing with sage... gets excited and forgets punctuation'
    },
    'StarSeeker23': {
      personality: 'Enthusiastic 20-something going through Saturn return, emotional and shares too much',
      emojis: '💫 😍 🌟 💖',
      background: '28-year-old from NYC, recently went through a breakup, found astrology during Saturn return crisis',
      replyStyle: 'Gets super excited!!!! overshares about dating drama, run-on sentences, uses way too many emojis'
    },
    'CosmicSkeptic': {
      personality: 'Skeptical data scientist but secretly fascinated, asks for evidence but is curious',
      emojis: '🤔 📊 🔬',
      background: 'Data scientist who got into astrology after accurate predictions, struggles with belief vs evidence',
      replyStyle: 'types carefully but sometimes uses internet shorthand like "tbh" or "ngl", admits when astrology was surprisingly accurate'
    }
  };
  
  return personalityMap[user.username as keyof typeof personalityMap] || {
    personality: 'Astrology enthusiast',
    emojis: '✨ 🌟',
    background: 'Interested in astrology',
    replyStyle: 'Shares thoughts and experiences'
  };
}

// Generate reply using DeepSeek AI
async function generateReplyWithDeepSeek(discussionData: any, seedConfigs: any[], aiConfig: any, replyIndex: number, selectedMood: string = 'supportive') {
  // Select a different seed user for each reply to ensure variety
  const availableUsers = seedConfigs.filter(user => user.username && user.writingStyle);
  if (availableUsers.length === 0) {
    throw new Error('No available seed users with valid configurations');
  }
  
  // Get existing replies to avoid repetition
  const existingReplies = discussionData.replies || [];
  const existingContent = existingReplies.map((r: any) => r.content).join('\n\n');
  const usedAuthors = new Set(existingReplies.map((r: any) => r.authorName || r.authorId));
  
  console.log('Existing authors:', Array.from(usedAuthors));
  console.log('Available users:', availableUsers.map(u => u.username));
  
  // Try to select a user who hasn't replied yet
  let selectedUser;
  const unusedUsers = availableUsers.filter(user => !usedAuthors.has(user.username));
  
  console.log('Unused users:', unusedUsers.map(u => u.username));
  
  if (unusedUsers.length > 0) {
    // Pick from users who haven't replied yet
    selectedUser = unusedUsers[Math.floor(Math.random() * unusedUsers.length)];
    console.log('Selected unused user:', selectedUser.username);
  } else {
    // If all users have replied, return error instead of allowing duplicates
    console.warn('All users have already replied, cannot generate unique reply');
    throw new Error('All available users have already replied to this discussion. Please delete some replies first or use fewer users.');
  }

  // Create detailed personality-based prompt for reply generation
  const personalityDetails = getPersonalityDetails(selectedUser);
  const moodInstructions = getMoodInstructions(selectedMood);
  
  const systemPrompt = `You are ${selectedUser.username}, a real person typing quickly on an astrology forum. 

PERSONALITY: ${personalityDetails.personality}
BACKGROUND: ${personalityDetails.background}
REPLY STYLE: ${personalityDetails.replyStyle}

🎭 CRITICAL MOOD REQUIREMENT: ${selectedMood.toUpperCase()}
${moodInstructions}

Your task is to write a single, authentic forum reply that MUST match the ${selectedMood} mood EXACTLY.

REPLY REQUIREMENTS:
- Write as ${selectedUser.username} would naturally type
- MANDATORY: Match the ${selectedMood} emotional tone exactly - this is the most important requirement
- Use casual internet typing style (lowercase, missing punctuation, etc.)
- Keep it 1-3 sentences maximum
- Include natural typing imperfections

${selectedMood === 'questioning' ? '🔍 QUESTIONING MOOD: You MUST ask questions, express curiosity, or wonder about the topic. Use "?" marks, phrases like "wait", "how", "why", "I wonder", etc.' : ''}
${selectedMood === 'excited' ? '✨ EXCITED MOOD: You MUST show enthusiasm with exclamation points, energetic language, and positive excitement.' : ''}
${selectedMood === 'concerned' ? '⚠️ CONCERNED MOOD: You MUST express worry, caution, or hesitation about the topic.' : ''}
${selectedMood === 'wise' ? '🧙 WISE MOOD: You MUST be thoughtful, measured, and share deeper insights or gentle guidance.' : ''}
${selectedMood === 'empathetic' ? '🤗 EMPATHETIC MOOD: You MUST show understanding, relate to others, and use compassionate language.' : ''}

IMPORTANT: Respond with ONLY the reply text itself, nothing else. Do not include JSON formatting, explanations, or meta-commentary. Just write the actual reply as ${selectedUser.username} would type it.`;

  const userPrompt = `Topic: "${discussionData.transformedTitle}"

${existingReplies.length > 0 ? `Avoid repeating: ${existingContent.substring(0, 200)}...` : ''}

Write your ${selectedMood} reply as ${selectedUser.username}:`;

  // Debug: Log the model being used
  const modelToUse = aiConfig.model || 'deepseek/deepseek-r1-distill-llama-70b:free';
  console.log('🤖 Using AI model for reply generation:', modelToUse);
  console.log('🤖 Full aiConfig received:', aiConfig);
  
  // Additional debugging for the specific error
  if (modelToUse === 'meta-llama/llama-3.1-70b-instruct:free') {
    console.error('🚨 DETECTED OLD MODEL! This model is no longer available.');
    console.error('🚨 aiConfig.model:', aiConfig.model);
    console.error('🚨 This should not happen if the frontend is working correctly.');
    throw new Error('Detected deprecated model meta-llama/llama-3.1-70b-instruct:free. Please update your AI configuration.');
  }

  // Call DeepSeek API
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${aiConfig.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'Orbit and Chill Reply Generation'
    },
    body: JSON.stringify({
      model: modelToUse,
      messages: [
        { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
      ],
      temperature: aiConfig.temperature || 0.7,
      max_tokens: 100, // Even smaller for short replies
      stop: ["}", "\n\n"] // Stop at natural break points
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI API error response:', errorText);
    
    // Handle rate limiting with more user-friendly messages
    if (response.status === 429) {
      const errorData = JSON.parse(errorText);
      if (errorData.error?.metadata?.raw?.includes('temporarily rate-limited upstream')) {
        throw new Error(`Model "${modelToUse}" is temporarily rate-limited. Please try again in a few minutes or select a different model.`);
      } else if (errorData.error?.metadata?.raw?.includes('rate limit')) {
        throw new Error(`Rate limit reached for model "${modelToUse}". Please try again later or consider upgrading your API plan.`);
      }
    }
    
    throw new Error(`AI API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  console.log('Full DeepSeek response:', JSON.stringify(result, null, 2));
  
  let aiOutput = result.choices?.[0]?.message?.content;
  const reasoning = result.choices?.[0]?.message?.reasoning;
  const finishReason = result.choices?.[0]?.finish_reason;

  // If content is empty but we have reasoning, try to extract from reasoning
  if (!aiOutput && reasoning) {
    console.log('Content empty, trying to extract from reasoning:', reasoning);
    
    // Try to find JSON in the reasoning
    const jsonMatch = reasoning.match(/\{[^}]*"content"[^}]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.content) {
          aiOutput = JSON.stringify(parsed);
          console.log('Extracted from reasoning:', aiOutput);
        }
      } catch (e) {
        console.warn('Could not parse JSON from reasoning');
      }
    }
    
    // Try to extract actual reply content from reasoning using better patterns
    if (!aiOutput) {
      // Look for quoted replies in reasoning
      const quotePatterns = [
        /"([^"]{15,100}[.!?])"/,  // Quoted sentences
        /'([^']{15,100}[.!?])'/,  // Single quoted sentences
        /reply.*?[:"]\s*([^.!?]{15,100}[.!?])/i,  // After "reply:"
        /response.*?[:"]\s*([^.!?]{15,100}[.!?])/i,  // After "response:"
        /would say.*?[:"]\s*([^.!?]{15,100}[.!?])/i,  // After "would say:"
        /something like.*?[:"]\s*([^.!?]{15,100}[.!?])/i,  // After "something like:"
      ];
      
      for (const pattern of quotePatterns) {
        const match = reasoning.match(pattern);
        if (match && match[1]) {
          aiOutput = match[1].trim();
          console.log('Extracted reply from reasoning pattern:', aiOutput);
          break;
        }
      }
    }
    
    // If still no luck, fall back to mock reply since reasoning doesn't contain actual replies
    if (!aiOutput && reasoning.length > 10) {
      console.warn('Model reasoning does not contain usable reply content, falling back to mock');
      return await generateMockReply(discussionData, [selectedUser], 0, selectedMood);
    }
  }

  if (!aiOutput) {
    console.error('No content in DeepSeek response:', result);
    
    // Check if it's a token limit issue
    if (finishReason === 'length') {
      console.warn('Model hit token limit, falling back to mock reply');
      return await generateMockReply(discussionData, [selectedUser], 0, selectedMood);
    }
    
    console.warn('Model returned empty content, falling back to mock reply');
    return await generateMockReply(discussionData, [selectedUser], 0, selectedMood);
  }
  
  // If response was truncated due to token limit, try to extract what we have
  if (finishReason === 'length') {
    console.warn('DeepSeek response was truncated due to token limit');
  }

  // Parse the direct text response (no JSON expected)
  let replyContent;
  try {
    console.log('Raw AI output for parsing:', aiOutput);
    
    // Clean the response - remove any JSON formatting if it accidentally included it
    let cleanedOutput = aiOutput.trim();
    
    // If it looks like JSON, try to extract the content
    if (cleanedOutput.startsWith('{') && cleanedOutput.includes('"content"')) {
      try {
        const parsed = JSON.parse(cleanedOutput);
        replyContent = parsed.content || cleanedOutput;
      } catch {
        // Extract content from malformed JSON
        const contentMatch = cleanedOutput.match(/"content"\s*:\s*"([^"]+)"/);
        replyContent = contentMatch ? contentMatch[1] : cleanedOutput;
      }
    } else {
      // Use the raw text as-is
      replyContent = cleanedOutput;
    }
    
    // Clean up any remaining formatting artifacts
    replyContent = replyContent
      .replace(/^\s*["']|["']\s*$/g, '') // Remove quotes
      .replace(/\\n/g, ' ') // Replace newlines
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    // Validate content length
    if (!replyContent || replyContent.length < 5) {
      throw new Error('Generated content too short');
    }
    
  } catch (parseError) {
    console.warn('Failed to parse AI response, using fallback:', parseError);
    console.warn('Original AI output was:', aiOutput);
    
    // Fallback to a simple extract
    replyContent = aiOutput
      .replace(/[{}[\]]/g, '') // Remove brackets
      .replace(/["']/g, '') // Remove quotes
      .replace(/content\s*[:=]\s*/i, '') // Remove content labels
      .trim();
      
    if (!replyContent || replyContent.length < 5) {
      replyContent = "This is really interesting!";
    }
  }

  // Final content validation
  const finalContent = replyContent || "This is really interesting!";
  
  // Generate truly unique ID using high-resolution timestamp and crypto random
  const uniqueId = `reply_${Date.now()}_${performance.now().toString().replace('.', '')}_${Math.random().toString(36).substring(2, 15)}`;
  
  return {
    id: uniqueId,
    content: finalContent,
    authorName: selectedUser.username,
    authorId: selectedUser.userId,
    avatar: selectedUser.profilePictureUrl || '/avatars/default.png',
    timestamp: new Date().toISOString(),
    upvotes: Math.floor(Math.random() * 15) + 1,
    downvotes: Math.floor(Math.random() * 3),
    reactionType: selectedMood || 'supportive',
    addingValue: 'Contributing to the discussion',
    aiGenerated: true,
    writingStyle: selectedUser.writingStyle,
    userExpertise: selectedUser.expertiseAreas,
    contentHash: Buffer.from(finalContent).toString('base64').substring(0, 10) // For duplicate detection
  };
}

// Generate mock reply (fallback)
async function generateMockReply(discussionData: any, seedConfigs: any[], replyIndex: number, selectedMood: string = 'supportive') {
  // Select a different user for variety
  const availableUsers = seedConfigs.filter(user => user.username && user.writingStyle);
  const userIndex = (replyIndex + Math.floor(Math.random() * availableUsers.length)) % availableUsers.length;
  const selectedUser = availableUsers[userIndex];
  
  // Get existing replies to avoid duplication
  const existingReplies = discussionData.replies || [];
  const usedContent = new Set(existingReplies.map((r: any) => r.content));
  
  const replyTemplates = {
    'professional_educational': [
      "honestly this aligns really well with what ive seen in charts over the years ✨",
      "yep this is pretty much textbook for how these transits work... seen it so many times",
      "from my experience this usually means big changes coming, like major ones",
      "the timing here is pretty interesting ngl, especially with everything else happening",
      "ive noticed similar patterns with clients lately... something is definitely shifting",
      "this resonates with traditional interpretations but the modern twist is spot on"
    ],
    'enthusiastic_personal': [
      "omg YES this is literally my life right now!! 😍✨",
      "wait this gave me actual chills... explains so much about whats been happening",
      "YESSS finally someone said it!! this resonates so hard",
      "this gives me hope tbh... been feeling this energy shift too 💫",
      "the timing of seeing this post tho... universe is speaking fr",
      "im totally feeling this!! like everything is clicking into place",
      "this is so spot on its scary... been noticing these changes recently"
    ],
    'analytical_questioning': [
      "this is interesting but tbh id love to see some data backing this up 🤔",
      "the correlation seems real but whats the sample size here?",
      "ngl this warrants more investigation... curious about the methodology",
      "would be more convincing with proper controls but still intriguing",
      "skeptical part of me wants peer review but the patterns are there 📊",
      "data scientist in me needs more proof but... this has been accurate in my life"
    ],
    'beginner_enthusiastic': [
      "wait im still learning but this makes SO much sense!! 🌙",
      "omg as someone new to this... this is absolutely mind blowing",
      "thank u for explaining this so clearly!! super helpful for newbies like me",
      "im a total newbie but this is blowing my mind rn 🥺",
      "this is so cool!! never realized astrology was this detailed",
      "just starting my astro journey and this is exactly what i needed ✨",
      "learning so much from posts like this... keep them coming pls!"
    ],
    'specialist_timing': [
      "the timing of this is pretty wild actually... especially right now",
      "considering current planetary stuff this timing is... interesting",
      "given whats happening astrologically this message hits different",
      "ngl the timing for this discussion is kinda perfect...",
      "this aligns with the current lunar phase were in... interesting",
      "perfect timing considering mercury retrograde and everything 🙃",
      "the cosmic timing of this is... honestly pretty wild"
    ]
  };
  
  const templates = replyTemplates[selectedUser.writingStyle as keyof typeof replyTemplates] || replyTemplates.enthusiastic_personal;
  
  // Find an unused template
  let content = '';
  let attempts = 0;
  while (attempts < templates.length) {
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    if (!usedContent.has(randomTemplate)) {
      content = randomTemplate;
      break;
    }
    attempts++;
  }
  
  // If all templates are used, modify one slightly
  if (!content) {
    const baseTemplate = templates[replyIndex % templates.length];
    content = `${baseTemplate} ${["Definitely worth exploring further!", "Looking forward to more insights!", "Thanks for bringing this up!", "This opens up so many possibilities!"][replyIndex % 4]}`;
  }
  
  // Generate truly unique ID for mock replies too
  const uniqueId = `reply_${Date.now()}_${performance.now().toString().replace('.', '')}_${Math.random().toString(36).substring(2, 15)}`;
  
  return {
    id: uniqueId,
    content,
    authorName: selectedUser.username,
    authorId: selectedUser.userId,
    avatar: selectedUser.profilePictureUrl || '/avatars/default.png',
    timestamp: new Date().toISOString(),
    upvotes: Math.floor(Math.random() * 15) + 1,
    downvotes: Math.floor(Math.random() * 3),
    reactionType: selectedMood,
    addingValue: 'Contributing personal perspective',
    aiGenerated: true,
    writingStyle: selectedUser.writingStyle,
    userExpertise: selectedUser.expertiseAreas
  };
}