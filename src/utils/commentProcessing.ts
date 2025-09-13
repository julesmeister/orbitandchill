/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Utility functions for processing and rephrasing Reddit comments using AI
 */
import { HumanizationService } from '@/services/humanizationService';

interface CommentWithPersona {
  originalComment: string;
  persona: any;
}

interface RephrasedCommentResult {
  originalComment: string;
  rephrasedComment: string;
  persona: any;
}

interface BatchRephraseResult {
  comments: RephrasedCommentResult[];
  hasPartialResults: boolean;
  extractedCount: number;
  totalRequested: number;
  error?: string;
}

/**
 * Extract clean comments from raw Reddit content
 */
export function extractRedditComments(redditContent: string): string[] {
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

/**
 * Parse AI response and extract rephrased comments with robust error handling
 * Returns whatever comments it can successfully extract
 */
export function parseAICommentsResponse(aiOutput: string): {
  results: Array<{originalComment: string, rephrasedComment: string}>;
  hasPartialResults: boolean;
  extractedCount: number;
} {
  if (!aiOutput || !aiOutput.trim()) {
    return { results: [], hasPartialResults: false, extractedCount: 0 };
  }

  // Clean up the response to extract JSON
  let jsonText = aiOutput.trim();
  
  // Remove any markdown formatting and explanations
  jsonText = jsonText.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
  jsonText = jsonText.replace(/^[^[\{]*/, '').replace(/[^\]\}]*$/, ''); // Remove non-JSON prefix/suffix
  
  let parsedResults = [];
  let hasPartialResults = false;
  
  try {
    // Try direct parsing first
    parsedResults = JSON.parse(jsonText);
  } catch (directParseError) {
    hasPartialResults = true; // We're likely dealing with truncated data
    
    // Try to find and extract JSON array
    const arrayMatch = jsonText.match(/\[[\s\S]*?\]/);
    if (arrayMatch) {
      let arrayString = arrayMatch[0];
      
      // Better handling of truncated JSON
      if (!arrayString.endsWith(']')) {
        
        // Find all complete comment objects and reconstruct array
        const objectMatches = arrayString.match(/\{\s*"originalComment"\s*:\s*"[^"]*"\s*,\s*"rephrasedComment"\s*:\s*"[^"]*"\s*\}/g);
        
        if (objectMatches && objectMatches.length > 0) {
          arrayString = '[\n  ' + objectMatches.join(',\n  ') + '\n]';
        } else {
          // Fallback: just close what we have
          const lastCompleteEnd = arrayString.lastIndexOf('}');
          if (lastCompleteEnd > -1) {
            arrayString = arrayString.substring(0, lastCompleteEnd + 1) + ']';
          }
        }
      }
      
      try {
        parsedResults = JSON.parse(arrayString);
      } catch (repairError) {
        
        // Enhanced manual extraction with better regex
        const manualResults = [];
        
        // Find all complete comment pairs, being more flexible with content
        const commentObjects = arrayString.match(/\{\s*"originalComment"\s*:\s*"[^"]*"\s*,\s*"rephrasedComment"\s*:\s*"[^"]*"\s*\}/g);
        
        if (commentObjects && commentObjects.length > 0) {
          
          for (const obj of commentObjects) {
            try {
              const parsed = JSON.parse(obj);
              manualResults.push({
                originalComment: parsed.originalComment,
                rephrasedComment: parsed.rephrasedComment
              });
            } catch (objError) {
              // Try manual field extraction for this object
              const originalMatch = obj.match(/"originalComment"\s*:\s*"([^"]+)"/);
              const rephrasedMatch = obj.match(/"rephrasedComment"\s*:\s*"([^"]+)"/);
              
              if (originalMatch && rephrasedMatch) {
                manualResults.push({
                  originalComment: originalMatch[1],
                  rephrasedComment: rephrasedMatch[1]
                });
              }
            }
          }
        }
        
        parsedResults = manualResults;
        if (parsedResults.length > 0) {
        } else {
        }
      }
    } else {
    }
  }
  
  if (!Array.isArray(parsedResults)) {
    parsedResults = [];
  }

  return {
    results: parsedResults,
    hasPartialResults: hasPartialResults,
    extractedCount: parsedResults.length
  };
}

/**
 * Batch rephrase multiple comments using AI
 */
export async function batchRephraseComments(
  comments: string[], 
  allPersonas: any[], 
  aiConfig: any
): Promise<BatchRephraseResult> {
  // Randomly assign personas to comments
  const commentsWithPersonas: CommentWithPersona[] = comments.map(comment => ({
    originalComment: comment,
    persona: allPersonas[Math.floor(Math.random() * allPersonas.length)]
  }));

  // Create batch prompt for all comments
  const systemPrompt = `You are rephrasing Reddit comments to make them sound like real people typing casually on their phones. Each comment should be rephrased according to the assigned persona's writing style with LOTS of human imperfections.

CRITICAL FORMATTING: Respond with a valid JSON array. Use simple double quotes only. No markdown, no code blocks, no explanations.

JSON Format:
[
  {"originalComment": "first comment", "rephrasedComment": "rephrased version"},
  {"originalComment": "second comment", "rephrasedComment": "rephrased version"}
]

🚫 HUMANIZATION REQUIREMENTS (CRITICAL):
- Include lots of typos (missing letters, wrong letters, autocorrect mistakes)
- Use casual contractions (im, dont, cant, youre, etc.)
- Add filler words (like, tbh, ngl, literally, actually, etc.)
- ALWAYS start lowercase (never capitalize first letter)
- Use internet slang and abbreviations (rn, fr, omg, wtf, etc.)
- Drop punctuation randomly (no periods, missing commas)
- Add trailing thoughts with "..." or incomplete sentences
- Include occasional self-corrections like "wait no" or "actually..."
- Use emotion/reaction words (ugh, yikes, lol, etc.)
- Sometimes repeat letters for emphasis (sooo, reallly, yesss)
- Make casual word choices (going → goin, nothing → nothin)
- Add common typos (the → teh, receive → recieve, separate → seperate)
- Use "bc" for "because", "&" for "and", "w/" for "with", etc.

TYPING IMPERFECTIONS TO INCLUDE:
- Mobile autocorrect fails and casual abbreviations everywhere
- Stream of consciousness writing with direction changes
- Hesitation markers like "i mean...", "like...", "idk..."
- NO proper punctuation or capitalization (too formal!)

REQUIREMENTS:
- Keep the same meaning and sentiment but make it sound SUPER casual
- Use the persona's natural writing style but with heavy human imperfections
- Make it sound like someone typing quickly on their phone
- Don't add new information, just rephrase casually
- Maintain the original tone but way more relaxed
- Focus only on rephrasing the actual comment text with lots of imperfections

RESPOND WITH ONLY THE JSON ARRAY.`;

  const commentsPrompt = commentsWithPersonas.map((item, index) => 
    `${index + 1}. WRITING STYLE: ${getPersonalityForPersona(item.persona.username)}
COMMENT TO REPHRASE: "${item.originalComment}"`
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
      max_tokens: 4000, // Increased to avoid truncation with smaller batches
      stop: ["\n\nOriginal:", "Comments to rephrase:", "PERSONA:"]
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

  // Parse the AI response
  const parseResult = parseAICommentsResponse(aiOutput);
  const parsedResults = parseResult.results;

  // Match results with personas
  const finalResults: RephrasedCommentResult[] = [];
  
  // Process whatever we successfully extracted
  for (let i = 0; i < Math.min(parsedResults.length, commentsWithPersonas.length); i++) {
    const aiResult = parsedResults[i];
    const originalData = commentsWithPersonas[i];
    
    // Use rephrased comment if available, otherwise fall back to original
    let rephrasedComment = aiResult.rephrasedComment || originalData.originalComment;
    const isRephrased = !!aiResult.rephrasedComment;
    
    // Apply additional humanization in case AI didn't follow instructions properly
    if (rephrasedComment) {
      const humanizationIntensity = HumanizationService.getIntensityForStyle(originalData.persona.writingStyle);
      rephrasedComment = HumanizationService.humanizeText(rephrasedComment, humanizationIntensity);
    }
    
    finalResults.push({
      originalComment: originalData.originalComment,
      rephrasedComment: rephrasedComment,
      persona: originalData.persona
    });
  }
  
  // Handle any remaining comments that weren't rephrased due to truncation
  if (parsedResults.length < commentsWithPersonas.length) {
    
    for (let i = parsedResults.length; i < commentsWithPersonas.length; i++) {
      const originalData = commentsWithPersonas[i];
      finalResults.push({
        originalComment: originalData.originalComment,
        rephrasedComment: originalData.originalComment, // Use original since AI didn't process it
        persona: originalData.persona
      });
    }
  }
  
  const rephrasedCount = finalResults.filter(r => r.rephrasedComment !== r.originalComment).length;
  
  return {
    comments: finalResults,
    hasPartialResults: parseResult.hasPartialResults || parsedResults.length < commentsWithPersonas.length,
    extractedCount: parsedResults.length,
    totalRequested: commentsWithPersonas.length,
    error: parseResult.hasPartialResults ? 'AI response was truncated. Some comments may not be rephrased.' : undefined
  };
}

/**
 * Get personality details for different personas
 */
export function getPersonalityForPersona(username: string): string {
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

/**
 * Get random mood for replies
 */
export function getRandomMood(): string {
  const moods = ['supportive', 'questioning', 'excited', 'wise', 'concerned', 'empathetic'];
  return moods[Math.floor(Math.random() * moods.length)];
}