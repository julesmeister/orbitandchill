/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getAllSeedUserConfigs } from '@/db/services/seedUserService';

// POST - Generate a single AI reply for a discussion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { discussionData, aiConfig, replyIndex = 0, selectedMood = 'supportive' } = body;
    
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
    const seedConfigs = await getAllSeedUserConfigs();
    if (seedConfigs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No seed user configurations found. Please create seed users first.' },
        { status: 400 }
      );
    }
    
    try {
      // Generate reply based on provider
      const reply = aiConfig.provider === 'deepseek' 
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
  
  return moodMap[mood] || moodMap['supportive'];
}

// Get detailed personality information for each user
function getPersonalityDetails(user: any) {
  const personalityMap = {
    'AstroMaven': {
      personality: 'Professional astrologer with 20+ years experience, warm but authoritative',
      emojis: '✨ 🔮 ⭐',
      background: 'Has a private practice in LA, studied under renowned astrologers, sees patterns others miss',
      replyStyle: 'Shares client insights (anonymously), references classical astrology, validates experiences with professional knowledge'
    },
    'MoonChild92': {
      personality: 'Sweet college student who just discovered astrology, eager to learn and very grateful',
      emojis: '🌙 🥺 💕 ✨',
      background: 'College student studying psychology, new to astrology, loves the emotional/spiritual aspects',
      replyStyle: 'Admits not knowing much, shares how astrology helps with anxiety, asks innocent questions'
    },
    'ConfusedSarah': {
      personality: 'Very confused newbie who discovered astrology through TikTok, asks basic questions',
      emojis: '😅 🤷‍♀️ 💭',
      background: 'Found astrology on TikTok, thinks Mercury retrograde means her phone will break, mixes up signs and houses',
      replyStyle: 'Asks really basic questions like "wait is Scorpio a water sign?", shares TikTok astrology facts that are wrong'
    },
    'WorkingMom47': {
      personality: 'Busy working mom who reads horoscopes during lunch break, practical but interested',
      emojis: '☕ 💼 🏃‍♀️',
      background: 'Single mom in Phoenix, reads daily horoscopes in between meetings, wants astrology to help with parenting',
      replyStyle: 'Quick comments between work, relates everything to her kids or work stress, apologizes for short responses'
    },
    'BrokeInCollege': {
      personality: 'Gen Z college freshman who knows zodiac signs from memes, casual and funny',
      emojis: '😂 💸 📱',
      background: 'College freshman who learned astrology from Instagram memes, thinks astrology is "lowkey accurate fr"',
      replyStyle: 'Uses Gen Z slang, makes meme references, relates everything to college life and being broke'
    },
    'CrystalKaren': {
      personality: 'Spiritual but confused, mixes astrology with crystals and sage, thinks everything is magic',
      emojis: '🔮 🌸 ✨',
      background: 'Lives in Austin, goes to crystal shops, burns sage for everything, thinks astrology and tarot are the same',
      replyStyle: 'Mentions crystals in every reply, suggests cleansing with sage, mixes spiritual practices together'
    },
    'StarSeeker23': {
      personality: 'Enthusiastic 20-something going through Saturn return, emotional and shares too much',
      emojis: '💫 😍 🌟 💖',
      background: '28-year-old from NYC, recently went through a breakup, found astrology during Saturn return crisis',
      replyStyle: 'Gets super excited, overshares about personal dating drama, asks follow-up questions, uses lots of emojis'
    },
    'CosmicSkeptic': {
      personality: 'Skeptical data scientist but secretly fascinated, asks for evidence but is curious',
      emojis: '🤔 📊 🔬',
      background: 'Data scientist who got into astrology after accurate predictions, struggles with belief vs evidence',
      replyStyle: 'Asks for statistical backing but admits when astrology was surprisingly accurate in their life'
    }
  };
  
  return personalityMap[user.username] || {
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
  const existingContent = existingReplies.map(r => r.content).join('\n\n');
  const usedAuthors = new Set(existingReplies.map(r => r.authorName || r.authorId));
  
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
  
  const systemPrompt = `You are ${selectedUser.username}, a real person posting on an astrology forum.

PERSONALITY: ${personalityDetails.personality}
MOOD EMOJIS: ${personalityDetails.emojis}
PERSONAL BACKGROUND: ${personalityDetails.background}
REPLY STYLE: ${personalityDetails.replyStyle}

CURRENT MOOD: ${selectedMood} - ${moodInstructions}

Write ONLY a JSON response like this:
{"content": "your natural, personal reply with appropriate emojis", "type": "${selectedMood}"}

IMPORTANT:
- Match the ${selectedMood} mood exactly
- Share a brief personal experience or feeling that fits this mood
- Use emojis that match both your personality AND the current mood
- Sound like a real person, not AI
- Keep it 1-3 sentences max
- Reference your own life/feelings when relevant`;

  const userPrompt = `Topic: "${discussionData.transformedTitle}"

${existingReplies.length > 0 ? `Avoid repeating: ${existingContent.substring(0, 200)}...` : ''}

Respond as ${selectedUser.username} in a ${selectedMood} mood. Share a personal perspective that matches this emotional tone.`;

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
      model: 'deepseek/deepseek-r1-distill-llama-70b:free',
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
    console.error('DeepSeek API error response:', errorText);
    throw new Error(`DeepSeek API error: ${response.status} ${response.statusText} - ${errorText}`);
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
    
    // If still no luck, fall back to mock reply since reasoning doesn't contain actual replies
    if (!aiOutput && reasoning.length > 10) {
      console.warn('DeepSeek reasoning does not contain usable reply content, falling back to mock');
      return await generateMockReply(discussionData, [selectedUser], 0);
    }
  }

  if (!aiOutput) {
    console.error('No content in DeepSeek response:', result);
    
    // Check if it's a token limit issue
    if (finishReason === 'length') {
      console.warn('DeepSeek hit token limit, falling back to mock reply');
      return await generateMockReply(discussionData, [selectedUser], 0);
    }
    
    console.warn('DeepSeek returned empty content, falling back to mock reply');
    return await generateMockReply(discussionData, [selectedUser], 0);
  }
  
  // If response was truncated due to token limit, try to extract what we have
  if (finishReason === 'length') {
    console.warn('DeepSeek response was truncated due to token limit');
  }

  // Parse the JSON response
  let replyData;
  try {
    console.log('Raw AI output for parsing:', aiOutput);
    
    // Clean the response - remove any extra text before/after JSON
    let cleanedOutput = aiOutput.trim();
    
    // Try to extract just the JSON part
    const jsonMatch = cleanedOutput.match(/\{[^}]*"content"[^}]*\}/);
    if (jsonMatch) {
      cleanedOutput = jsonMatch[0];
    }
    
    // Try to parse
    try {
      replyData = JSON.parse(cleanedOutput);
    } catch {
      // If JSON parsing fails, extract content manually
      const contentMatch = cleanedOutput.match(/"content"\s*:\s*"([^"]+)"/);
      if (contentMatch) {
        replyData = {
          content: contentMatch[1],
          type: "supportive"
        };
      } else {
        // If no JSON structure, try to extract any readable content
        let extractedContent = cleanedOutput
          .replace(/[{}]/g, '') // Remove braces
          .replace(/"content":\s*"?/i, '') // Remove content label
          .replace(/"type".*$/i, '') // Remove type info
          .trim();
          
        // If we have some content, use it
        if (extractedContent && extractedContent.length > 10) {
          replyData = {
            content: extractedContent,
            type: "supportive"
          };
        } else {
          throw new Error('Could not extract content from response');
        }
      }
    }
    
    // Validate that we have clean content
    if (replyData.content && replyData.content.includes('**Content:**')) {
      // AI returned malformed content, extract just the actual reply
      const cleanContent = replyData.content
        .replace(/\*\*Content:\*\*\s*"?([^"]*)"?.*/, '$1')
        .replace(/\*\*ReactionType:\*\*.*/, '')
        .replace(/\*\*AddingValue:\*\*.*/, '')
        .trim();
      replyData.content = cleanContent || "This is really interesting!";
    }
    
  } catch (parseError) {
    console.warn('Failed to parse AI JSON response, using fallback:', parseError);
    console.warn('Original AI output was:', aiOutput);
    
    // Enhanced fallback - try to extract any readable content
    let fallbackContent = aiOutput
      .replace(/\{.*?"content"\s*:\s*"([^"]+)".*\}/, '$1')
      .replace(/.*"content"\s*:\s*"([^"]+)".*/, '$1')
      .replace(/\*\*Content:\*\*\s*"?([^"*]+)"?.*/, '$1')
      .trim();
      
    if (!fallbackContent || fallbackContent === aiOutput) {
      fallbackContent = "This is a really interesting perspective!";
    }
    
    replyData = {
      content: fallbackContent,
      type: "supportive"
    };
  }

  // Final content validation
  const finalContent = replyData.content || "This is really interesting!";
  
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
    reactionType: replyData.type || 'supportive',
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
      "From an astrological perspective, this aligns perfectly with traditional interpretations.",
      "This is a textbook example of how these transits manifest in real life.",
      "Based on my professional experience, this pattern typically indicates a major transformation period.",
      "The astrological implications here are quite profound and significant.",
      "I've observed similar patterns in client charts over the years.",
      "The timing of this insight is particularly noteworthy from a professional standpoint."
    ],
    'enthusiastic_personal': [
      "OMG this is exactly what I've been experiencing! So relatable!",
      "I literally got chills reading this! This explains everything!",
      "YES! This resonates so deeply with me right now.",
      "This gives me such hope and excitement about what's coming!",
      "WOW! The synchronicity of seeing this post is incredible!",
      "I'm totally feeling this energy shift in my own life too!",
      "This is SO spot on! I've been noticing these changes recently."
    ],
    'analytical_questioning': [
      "This is interesting, but I'd love to see some statistical analysis backing this up.",
      "The correlation here seems significant, but what's the methodology behind it?",
      "From an empirical standpoint, this definitely warrants further investigation.",
      "I'm curious about the sample size for these observations.",
      "The data would be more convincing with proper controls in place.",
      "This hypothesis needs peer-reviewed research to validate it properly."
    ],
    'beginner_enthusiastic': [
      "Wow, I'm still learning but this makes so much sense!",
      "As someone new to this, I find this absolutely fascinating!",
      "Thank you for explaining this so clearly! Super helpful for beginners.",
      "I'm a total newbie but this is blowing my mind right now!",
      "This is so cool! I never realized astrology was this detailed.",
      "I'm just starting my astrological journey and this is exactly what I needed!",
      "Learning so much from posts like this! Keep them coming!"
    ],
    'specialist_timing': [
      "The timing of this observation is particularly significant right now.",
      "Considering the current planetary positions, this timing is optimal.",
      "Given our current astrological climate, this message has potent timing.",
      "The celestial timing for this discussion is absolutely remarkable.",
      "This aligns perfectly with the current lunar phase we're in.",
      "Perfect timing given the Mercury retrograde cycle we're experiencing.",
      "The cosmic timing of this insight couldn't be more appropriate."
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