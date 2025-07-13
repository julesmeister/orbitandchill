/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getAllSeedUserConfigs } from '@/db/services/seedUserService';

// POST - Process Reddit comments and assign random personas
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { comments, aiConfig, discussionContext } = body;
    
    if (!comments || !comments.trim()) {
      return NextResponse.json(
        { success: false, error: 'Comments text is required' },
        { status: 400 }
      );
    }
    
    if (!aiConfig || !aiConfig.provider || !aiConfig.apiKey) {
      return NextResponse.json(
        { success: false, error: 'AI configuration with provider and API key is required' },
        { status: 400 }
      );
    }
    
    // Get available seed users for random assignment
    const allSeedConfigs = await getAllSeedUserConfigs();
    if (allSeedConfigs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No seed user configurations found. Please create seed users first.' },
        { status: 400 }
      );
    }
    
    // Clean Reddit content and extract actual comments
    const cleanedComments = extractRedditComments(comments);
    console.log(`Extracted ${cleanedComments.length} clean comments from Reddit content`);
    
    console.log(`Processing ${cleanedComments.length} comments for rephrasing`);
    
    if (cleanedComments.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid comments found. Make sure comments are separated by line breaks and are substantial.' },
        { status: 400 }
      );
    }
    
    // Process comments with AI rephrasing and random persona assignment
    const processedReplies = [];
    
    // Limit to first 20 comments and process in batch
    const commentsToProcess = cleanedComments.slice(0, 20);
    console.log(`Processing ${commentsToProcess.length} comments in batch to avoid rate limits`);
    
    try {
      // Process all comments in a single AI request
      const batchRephrasedComments = await batchRephraseComments(commentsToProcess, allSeedConfigs, aiConfig);
      
      // Create reply objects for each rephrased comment
      for (let i = 0; i < batchRephrasedComments.length; i++) {
        const { originalComment, rephrasedComment, persona } = batchRephrasedComments[i];
        
        // Generate random timestamp for natural conversation flow
        // Discussion starts 1-7 days ago, replies spread out after that
        const now = new Date();
        const discussionStartTime = new Date(now.getTime() - (Math.random() * 7 * 24 * 60 * 60 * 1000)); // 1-7 days ago
        
        // Replies come progressively after discussion start
        const minDelayHours = i * 0.5 + Math.random() * 2; // Stagger replies (30min - 2h apart)
        const maxDelayHours = 72; // Up to 3 days after discussion start
        const randomDelayHours = minDelayHours + Math.random() * (maxDelayHours - minDelayHours);
        const replyTime = new Date(discussionStartTime.getTime() + (randomDelayHours * 60 * 60 * 1000));
        
        // Create reply object
        const reply = {
          id: `reply_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 15)}`,
          content: rephrasedComment,
          authorName: persona.username,
          authorId: persona.userId,
          avatar: persona.profilePictureUrl || '/avatars/default.png',
          timestamp: replyTime.toISOString(),
          upvotes: Math.floor(Math.random() * 20) + 1,
          downvotes: Math.floor(Math.random() * 5),
          reactionType: getRandomMood(),
          aiGenerated: true,
          writingStyle: persona.writingStyle,
          userExpertise: persona.expertiseAreas,
          originalComment: originalComment,
          isRephrased: true
        };
        
        processedReplies.push(reply);
      }
      
    } catch (error) {
      console.error('Batch processing failed, falling back to original comments:', error);
      
      // Fallback: Use original comments with random personas
      for (let i = 0; i < commentsToProcess.length; i++) {
        const originalComment = commentsToProcess[i];
        const randomPersona = allSeedConfigs[Math.floor(Math.random() * allSeedConfigs.length)];
        
        // Also stagger fallback replies
        const now = new Date();
        const discussionStartTime = new Date(now.getTime() - (Math.random() * 7 * 24 * 60 * 60 * 1000)); // 1-7 days ago
        const minDelayHours = i * 0.5 + Math.random() * 2;
        const maxDelayHours = 72;
        const randomDelayHours = minDelayHours + Math.random() * (maxDelayHours - minDelayHours);
        const fallbackReplyTime = new Date(discussionStartTime.getTime() + (randomDelayHours * 60 * 60 * 1000));

        const fallbackReply = {
          id: `reply_${Date.now()}_${i}_fallback`,
          content: originalComment,
          authorName: randomPersona.username,
          authorId: randomPersona.userId,
          avatar: randomPersona.profilePictureUrl || '/avatars/default.png',
          timestamp: fallbackReplyTime.toISOString(),
          upvotes: Math.floor(Math.random() * 15) + 1,
          downvotes: Math.floor(Math.random() * 3),
          reactionType: getRandomMood(),
          aiGenerated: false,
          writingStyle: randomPersona.writingStyle,
          userExpertise: randomPersona.expertiseAreas,
          originalComment: originalComment,
          isRephrased: false
        };
        
        processedReplies.push(fallbackReply);
      }
    }
    
    const skippedComments = cleanedComments.length - commentsToProcess.length;
    const successMessage = skippedComments > 0 
      ? `Successfully processed ${processedReplies.length} comments (${skippedComments} skipped to avoid rate limits)`
      : `Successfully processed ${processedReplies.length} comments with random persona assignments`;

    // Generate a batch ID for compatibility with seeding workflow
    const batchId = `comments_batch_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    return NextResponse.json({
      success: true,
      data: processedReplies,
      message: successMessage,
      batchId: batchId, // Add batch ID for Generate Forum compatibility
      summary: {
        totalComments: cleanedComments.length,
        processedReplies: processedReplies.length,
        skippedComments: skippedComments,
        rephrasedCount: processedReplies.filter(r => r.isRephrased).length,
        fallbackCount: processedReplies.filter(r => !r.isRephrased).length
      }
    });
    
  } catch (error) {
    console.error('Error processing comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process comments: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// Batch rephrase multiple comments in a single AI request
async function batchRephraseComments(comments: string[], allPersonas: any[], aiConfig: any): Promise<Array<{originalComment: string, rephrasedComment: string, persona: any}>> {
  // Randomly assign personas to comments
  const commentsWithPersonas = comments.map(comment => ({
    originalComment: comment,
    persona: allPersonas[Math.floor(Math.random() * allPersonas.length)]
  }));

  // Create batch prompt for all comments
  const systemPrompt = `You are rephrasing multiple Reddit comments to make them unique while preserving their core meaning and sentiment. Each comment should be rephrased according to the assigned persona's writing style.

IMPORTANT: Respond with a JSON array where each object has this structure:
{
  "originalComment": "original text",
  "rephrasedComment": "rephrased text as the persona would write it"
}

REQUIREMENTS for each rephrasing:
- Keep the same general meaning and sentiment
- Use the assigned persona's natural writing style
- Make it sound like the persona wrote it originally
- Keep it authentic and conversational
- Don't add new information, just rephrase
- Maintain the original tone (positive, negative, neutral)

RESPOND WITH ONLY THE JSON ARRAY, NOTHING ELSE.`;

  const commentsPrompt = commentsWithPersonas.map((item, index) => 
    `${index + 1}. PERSONA: ${item.persona.username} (${getPersonalityForPersona(item.persona.username)})
ORIGINAL: "${item.originalComment}"`
  ).join('\n\n');

  const modelToUse = aiConfig.model || 'deepseek/deepseek-r1-distill-llama-70b:free';
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${aiConfig.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'Orbit and Chill Batch Comment Rephrasing'
    },
    body: JSON.stringify({
      model: modelToUse,
      messages: [
        { role: 'user', content: `${systemPrompt}\n\nComments to rephrase:\n\n${commentsPrompt}` }
      ],
      temperature: aiConfig.temperature || 0.7,
      max_tokens: 2000,
      stop: ["\n\nOriginal:", "Comments to rephrase:"]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI API error for batch comment rephrasing:', errorText);
    throw new Error(`AI API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  let aiOutput = result.choices?.[0]?.message?.content?.trim();
  
  if (!aiOutput) {
    throw new Error('AI returned empty response for batch processing');
  }

  try {
    // Clean up the response to extract JSON
    let jsonText = aiOutput;
    
    // Remove any markdown formatting
    jsonText = jsonText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    
    // Try to find JSON array in the response
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    const parsedResults = JSON.parse(jsonText);
    
    if (!Array.isArray(parsedResults)) {
      throw new Error('AI response is not an array');
    }

    // Match results with personas
    const finalResults = [];
    for (let i = 0; i < Math.min(parsedResults.length, commentsWithPersonas.length); i++) {
      const aiResult = parsedResults[i];
      const originalData = commentsWithPersonas[i];
      
      finalResults.push({
        originalComment: originalData.originalComment,
        rephrasedComment: aiResult.rephrasedComment || aiResult.rephrased || originalData.originalComment,
        persona: originalData.persona
      });
    }
    
    return finalResults;
    
  } catch (parseError) {
    console.error('Failed to parse batch AI response:', parseError);
    console.error('Raw AI output:', aiOutput);
    throw new Error('Failed to parse AI response for batch processing');
  }
}

// Rephrase a single comment using AI (legacy function)
async function rephraseCommentWithAI(originalComment: string, persona: any, aiConfig: any): Promise<string> {
  const systemPrompt = `You are rephrasing a Reddit comment to make it unique while preserving the core meaning and sentiment. 

PERSONA: ${persona.username}
WRITING STYLE: ${persona.writingStyle}
PERSONALITY: ${getPersonalityForPersona(persona.username)}

Your task is to rephrase the following Reddit comment as ${persona.username} would write it, maintaining the original sentiment but making it unique.

REQUIREMENTS:
- Keep the same general meaning and sentiment
- Use ${persona.username}'s natural writing style 
- Make it sound like ${persona.username} wrote it originally
- Keep it authentic and conversational
- Don't add new information, just rephrase
- Maintain the original tone (positive, negative, neutral)

IMPORTANT: Respond with ONLY the rephrased comment, nothing else.`;

  const userPrompt = `Original Reddit comment to rephrase:
"${originalComment}"

Rephrase this as ${persona.username} would write it:`;

  const modelToUse = aiConfig.model || 'deepseek/deepseek-r1-distill-llama-70b:free';
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${aiConfig.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'Orbit and Chill Comment Rephrasing'
    },
    body: JSON.stringify({
      model: modelToUse,
      messages: [
        { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
      ],
      temperature: aiConfig.temperature || 0.7,
      max_tokens: 200,
      stop: ["\n\n", "Original comment:", "Rephrased:"]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI API error for comment rephrasing:', errorText);
    throw new Error(`AI API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  let rephrasedText = result.choices?.[0]?.message?.content?.trim();
  
  if (!rephrasedText || rephrasedText.length < 10) {
    throw new Error('AI returned empty or too short rephrased comment');
  }
  
  // Clean up any remaining artifacts
  rephrasedText = rephrasedText
    .replace(/^["']|["']$/g, '') // Remove quotes
    .replace(/^Rephrased.*?:/i, '') // Remove "Rephrased:" labels
    .replace(/^As.*?:/i, '') // Remove "As PersonaName:" labels
    .trim();
  
  return rephrasedText;
}

// Extract clean comments from raw Reddit content
function extractRedditComments(redditContent: string): string[] {
  const lines = redditContent.split('\n').map(line => line.trim());
  const cleanComments: string[] = [];
  
  // Patterns to ignore (Reddit UI elements)
  const ignorePatterns = [
    /^u\/\w+/,                          // usernames like "u/username"
    /^\w+$/,                            // single words (likely usernames)
    /^•$/,                              // bullet points
    /^\d+d? ago$/,                      // timestamps like "17d ago"
    /^(Upvote|Downvote|Reply|Award|Share)$/i, // Reddit buttons
    /^reply$/i,                         // "reply" text
    /^\d+$/,                            // numbers (vote counts)
    /^Profile Badge/,                   // Reddit badges
    /^Top \d+%/,                        // Reddit achievements
    /^OP$/,                             // "OP" marker
    /^avatar$/,                         // avatar text
    /^\[deleted\]$/,                    // deleted content
    /^\d+ more repl/,                   // "7 more replies"
    /^•\s*Edited/,                      // edit markers
    /^$/                                // empty lines
  ];
  
  for (const line of lines) {
    // Skip if line matches any ignore pattern
    if (ignorePatterns.some(pattern => pattern.test(line))) {
      continue;
    }
    
    // Skip very short lines (likely UI elements)
    if (line.length < 15) {
      continue;
    }
    
    // Skip lines that are mostly punctuation or special characters
    if (/^[^a-zA-Z]*$/.test(line)) {
      continue;
    }
    
    // Skip if line starts with common Reddit formatting
    if (line.startsWith('|') || line.startsWith('♎') || line.startsWith('♋')) {
      continue;
    }
    
    // This looks like actual comment content
    cleanComments.push(line);
  }
  
  // Further filter to remove duplicates and very similar content
  const uniqueComments = cleanComments.filter((comment, index) => {
    // Remove duplicates
    if (cleanComments.indexOf(comment) !== index) {
      return false;
    }
    
    // Remove very short comments
    if (comment.length < 20) {
      return false;
    }
    
    return true;
  });
  
  console.log(`Original lines: ${lines.length}, Filtered to: ${uniqueComments.length} clean comments`);
  console.log('Sample extracted comments:', uniqueComments.slice(0, 3));
  
  return uniqueComments;
}

// Get random mood for replies
function getRandomMood(): string {
  const moods = ['supportive', 'questioning', 'excited', 'wise', 'concerned', 'empathetic'];
  return moods[Math.floor(Math.random() * moods.length)];
}

// Get personality details for different personas
function getPersonalityForPersona(username: string): string {
  const personalityMap: Record<string, string> = {
    'AstroMaven': 'Professional astrologer with 20+ years experience, warm but authoritative',
    'MoonChild92': 'Sweet college student who just discovered astrology, eager to learn and very grateful',
    'ConfusedSarah': 'Very confused newbie who discovered astrology through TikTok, asks basic questions',
    'WorkingMom47': 'Busy working mom who reads horoscopes during lunch break, practical but interested',
    'BrokeInCollege': 'Gen Z college freshman who knows zodiac signs from memes, casual and funny',
    'CrystalKaren': 'Spiritual but confused, mixes astrology with crystals and sage, thinks everything is magic',
    'StarSeeker23': 'Enthusiastic 20-something going through Saturn return, emotional and shares too much',
    'CosmicSkeptic': 'Skeptical data scientist but secretly fascinated, asks for evidence but is curious',
    'YogaBae': 'Wellness-focused yoga instructor who integrates astrology with spiritual practice',
    'CuriousCat': 'Naturally inquisitive person who asks thoughtful questions about everything',
    'PartyPlanet': 'Fun-loving social butterfly who uses astrology to understand relationships',
    'AstroNewbie': 'Complete beginner to astrology, enthusiastic but makes basic mistakes',
    'MidnightMystic': 'Night owl who studies esoteric astrology and loves deep conversations',
    'AnxiousAnna': 'Worried person who uses astrology to understand and cope with anxiety',
    'CollegeBroke': 'Budget-conscious student who relates everything to financial struggles',
    'MercuryMind': 'Communication-focused person who loves analyzing Mercury placements',
    'PlutoPower': 'Intense person drawn to transformational and shadow work astrology',
    'CosmicRebel': 'Alternative lifestyle person who uses astrology for empowerment',
    'MoonMama': 'Maternal figure who nurtures others through astrological guidance',
    'CosmicHealer': 'Healer who combines astrology with therapeutic modalities',
    'AstroAnalyst': 'Detail-oriented person who loves technical aspects of astrology'
  };
  
  return personalityMap[username] || 'Astrology enthusiast with unique perspective';
}