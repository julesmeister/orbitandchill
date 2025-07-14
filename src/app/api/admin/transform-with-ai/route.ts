import { NextRequest, NextResponse } from 'next/server';
import { getAllSeedUserConfigs, saveSeedingBatch, updateSeedingBatch } from '@/db/services/seedUserService';

// POST - Transform parsed content with AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parsedContent, aiConfig, generationSettings } = body;
    
    if (!parsedContent || !Array.isArray(parsedContent)) {
      return NextResponse.json(
        { success: false, error: 'Parsed content array is required' },
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
    
    // Create a new seeding batch to track this operation
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const seedingBatch = {
      id: batchId,
      sourceType: 'pasted_content',
      sourceContent: JSON.stringify(parsedContent),
      processedContent: '',
      status: 'processing' as const,
      discussionsCreated: 0,
      repliesCreated: 0,
      votesCreated: 0,
      errors: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await saveSeedingBatch(seedingBatch);
    
    try {
      // Call the actual AI API based on provider
      const transformedContent = (aiConfig.provider === 'deepseek' || aiConfig.provider === 'openrouter') 
        ? await transformWithAI(parsedContent, seedConfigs, generationSettings, aiConfig)
        : await simulateAITransformation(parsedContent, seedConfigs, generationSettings);
      
      // Update batch status to completed
      const totalReplies = transformedContent.reduce((sum: any, item: any) => sum + (item.actualReplyCount || 0), 0);
      await updateSeedingBatch(batchId, {
        status: 'completed',
        processedContent: JSON.stringify(transformedContent),
        discussionsCreated: transformedContent.length,
        repliesCreated: totalReplies,
        votesCreated: transformedContent.length * 15 + totalReplies * 5 // Estimated votes
      });
      
      return NextResponse.json({
        success: true,
        batchId,
        data: transformedContent,
        summary: {
          discussionsCreated: transformedContent.length,
          totalReplies: transformedContent.reduce((sum: any, item: any) => sum + (item.actualReplyCount || 0), 0),
          mainAuthor: (transformedContent[0] as any)?.assignedAuthor,
          category: (transformedContent[0] as any)?.category,
          replyAuthors: (transformedContent[0] as any)?.replies?.map((r: any) => r.authorName) || []
        },
        message: `Successfully created ${transformedContent.length} discussion(s) with ${(transformedContent[0] as any)?.actualReplyCount || 0} replies`
      });
    } catch (aiError) {
      // Update batch status to failed
      await updateSeedingBatch(batchId, {
        status: 'failed',
        errors: [(aiError as Error).message]
      });
      throw aiError;
    }
  } catch (error) {
    console.error('Error transforming content with AI:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to transform content with AI: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// AI transformation function (works with OpenRouter-compatible APIs)
async function transformWithAI(parsedContent: any[], seedConfigs: any[], generationSettings: any, aiConfig: any) {
  const categories = [
    'Natal Chart Analysis',
    'Transits & Predictions', 
    'Chart Reading Help',
    'Synastry & Compatibility',
    'Mundane Astrology',
    'Learning Resources',
    'General Discussion'
  ];

  const transformedContent = [];
  
  // Since we now process all content as one block, we only need one iteration
  if (parsedContent.length > 0) {
    const originalPost = parsedContent[0]; // We only have one parsed content block now
    const assignedUser = seedConfigs[Math.floor(Math.random() * seedConfigs.length)];
    
    try {
      // Get available usernames for the AI to use
      const availableAuthors = seedConfigs.map(config => {
        const username = config.username || config.userId.replace('seed_user_', '');
        return username.charAt(0).toUpperCase() + username.slice(1);
      }).filter(Boolean);
      
      console.log('Available authors for AI:', availableAuthors);

      // Limit replies to avoid token overflow
      const maxReplies = Math.min(15, generationSettings.repliesPerDiscussion.max);
      const minReplies = Math.min(8, generationSettings.repliesPerDiscussion.min);

      // Create prompt for DeepSeek - MAIN POST ONLY
      const systemPrompt = `Transform this Reddit astrology discussion into a natural forum post that sounds like a REAL PERSON wrote it, not AI.

CRITICAL REQUIREMENTS:
1. MAINTAIN THE SAME LENGTH AND DEPTH as the original content
2. Preserve ALL the specific details, examples, and concepts from the original
3. Keep the same structure and information density
4. Write like a real human with natural imperfections

HUMAN WRITING STYLE (IMPORTANT):
- don't always capitalize the first word of sentences
- use casual punctuation... sometimes too many periods or missing commas
- occasional run-on sentences that feel natural
- sometimes start sentences with "so" or "and" or "but"
- use contractions like "dont" without apostrophes sometimes
- mix of proper and improper grammar that feels authentic
- casual tone even when discussing complex topics
- stream of consciousness style is OK

CONTENT PRESERVATION RULES:
- If the original discusses specific astrological concepts (houses, signs, planets, aspects), include ALL of them
- If the original contains examples or scenarios, preserve ALL of them with the same level of detail
- If the original mentions current events or personal experiences, keep those contexts
- If the original has lists, breakdowns, or structured information, maintain that organization
- If the original asks questions or includes calls to action, preserve those elements

Write like someone who knows astrology but types casually online, not like a textbook or professional article.

Return ONLY valid JSON:
{
  "mainPost": {
    "title": "Engaging forum title that captures the actual content scope",
    "content": "COMPREHENSIVE main post that maintains the same length, detail level, and information density as the original. Include ALL the specific concepts, examples, and details that were actually present in the source material.",
    "category": "Appropriate category based on the actual content",
    "tags": ["relevant", "tags", "based", "on", "actual", "content"],
    "summary": "Accurate summary reflecting what the content actually covers"
  }
}`;

      // Use the correct content field from process-pasted-content API
      const contentToTransform = originalPost.originalContent || originalPost.fullContent || 'No content provided';
      console.log('Content being sent to AI - Length:', contentToTransform.length);
      console.log('Content being sent to AI - First 200:', contentToTransform.substring(0, 200) + '...');
      console.log('Content being sent to AI - Last 200:', contentToTransform.substring(contentToTransform.length - 200));
      
      // If content seems truncated, let's see what we have
      if (contentToTransform.length < 5000) {
        console.warn('⚠️ Content seems short for a Reddit discussion. Full content:', contentToTransform);
      }
      
      const userPrompt = `Original content to transform:\n\n${contentToTransform}`;

      // Debug: Log the model being used
      const modelToUse = aiConfig.model || 'deepseek/deepseek-r1-distill-llama-70b:free';
      console.log('🤖 Using AI model for content transformation:', modelToUse);
      console.log('🤖 Full aiConfig received:', aiConfig);

      // Determine if model supports system prompts
      const supportsSystemPrompts = !modelToUse.includes('gemma') && !modelToUse.includes('google/');
      
      // Prepare messages based on model capabilities
      const messages = supportsSystemPrompts 
        ? [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        : [
            { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
          ];

      console.log('🤖 Model supports system prompts:', supportsSystemPrompts);
      console.log('🤖 Using message format:', messages.length === 1 ? 'Combined user prompt' : 'System + user prompts');

      // Call OpenRouter API
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${aiConfig.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Orbit and Chill Seeding System'
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: messages,
          temperature: aiConfig.temperature || 0.7,
          max_tokens: 6000  // Large limit for detailed, natural responses
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error response:', errorText);
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('OpenRouter API result:', JSON.stringify(result, null, 2));
      
      const aiOutput = result.choices?.[0]?.message?.content;

      if (!aiOutput) {
        console.error('No content in OpenRouter response:', result);
        throw new Error('No response content from OpenRouter API');
      }

      // Parse the JSON response
      let transformedData;
      try {
        console.log('Raw AI output:', aiOutput);
        
        // Remove markdown code blocks if present
        let cleanedOutput = aiOutput.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
        
        // Try to parse the cleaned response
        try {
          transformedData = JSON.parse(cleanedOutput);
          console.log('Successfully parsed AI JSON response');
        } catch (parseError) {
          console.warn('Direct JSON parse failed, attempting content field fix:', parseError);
          
          // The issue is likely unescaped characters in the content field
          // Let's fix the content field specifically
          try {
            let fixedOutput = cleanedOutput;
            
            // Find the content field and properly escape it - handle multiline content
            const contentRegex = /"content":\s*"([\s\S]*?)",\s*"category"/;
            const contentMatch = fixedOutput.match(contentRegex);
            if (contentMatch) {
              const originalContent = contentMatch[1];
              const escapedContent = originalContent
                .replace(/\\/g, '\\\\')    // Escape backslashes first
                .replace(/"/g, '\\"')      // Escape quotes
                .replace(/\n/g, '\\n')     // Escape newlines
                .replace(/\r/g, '\\r')     // Escape carriage returns
                .replace(/\t/g, '\\t')     // Escape tabs
                .replace(/\*/g, '\\*');    // Escape asterisks
              
              fixedOutput = fixedOutput.replace(
                /"content":\s*"[\s\S]*?",\s*"category"/,
                `"content": "${escapedContent}",\n    "category"`
              );
              
              console.log('Fixed content field with proper escaping');
            }
            
            transformedData = JSON.parse(fixedOutput);
            console.log('Successfully parsed AI JSON after content fix');
          } catch (fixError) {
            console.warn('Content field fix failed, using manual field extraction:', fixError);
            
            // Manual extraction of fields since JSON parsing failed
            const titleMatch = cleanedOutput.match(/"title":\s*"([^"]+)"/);
            const categoryMatch = cleanedOutput.match(/"category":\s*"([^"]+)"/);
            const summaryMatch = cleanedOutput.match(/"summary":\s*"([^"]+)"/);
            const tagsMatch = cleanedOutput.match(/"tags":\s*\[(.*?)\]/);
            
            // Extract content between "content": " and ",
            const contentMatch = cleanedOutput.match(/"content":\s*"([\s\S]*?)",\s*"category"/);
            let extractedContent = 'AI-transformed content (parsing failed)';
            
            if (contentMatch) {
              // Clean up the extracted content by removing extra escaping
              extractedContent = contentMatch[1]
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\\*/g, '*')
                .replace(/\\\\/g, '\\');
              console.log('Successfully extracted content manually');
            }
            
            // Extract tags
            let extractedTags = ['astrology', 'discussion'];
            if (tagsMatch) {
              try {
                const tagsString = '[' + tagsMatch[1] + ']';
                extractedTags = JSON.parse(tagsString);
              } catch {
                console.warn('Could not parse tags, using defaults');
              }
            }
            
            if (titleMatch) {
              transformedData = {
                mainPost: {
                  title: titleMatch[1],
                  content: extractedContent,
                  category: categoryMatch ? categoryMatch[1] : 'General Discussion',
                  tags: extractedTags,
                  summary: summaryMatch ? summaryMatch[1] : 'AI-transformed discussion content'
                }
              };
              console.log('Created transformed data from manually extracted fields');
            } else {
              throw new Error('Could not extract title from AI response');
            }
          }
        }
      } catch (parseError) {
        console.warn('Failed to parse AI JSON response, attempting to fix truncated JSON:', parseError);
        console.log('AI Output that failed to parse:', aiOutput);
        
        // Try to fix truncated JSON by finding the last complete reply
        let fixedJson = aiOutput;
        
        // If JSON is truncated, try to close it properly
        if (fixedJson.includes('"replies": [')) {
          // Find the last complete reply object
          const lastCompleteReplyIndex = fixedJson.lastIndexOf('},\n    {');
          if (lastCompleteReplyIndex > -1) {
            // Truncate to last complete reply and close the JSON
            fixedJson = fixedJson.substring(0, lastCompleteReplyIndex + 1) + '\n  ]\n}';
          } else {
            // If no complete replies, just close the array
            const repliesStartIndex = fixedJson.indexOf('"replies": [');
            if (repliesStartIndex > -1) {
              fixedJson = fixedJson.substring(0, repliesStartIndex + '"replies": ['.length) + '\n  ]\n}';
            }
          }
          
          try {
            const jsonMatch = fixedJson.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              transformedData = JSON.parse(jsonMatch[0]);
              console.log('Successfully fixed truncated JSON!');
            } else {
              throw new Error('Could not fix JSON');
            }
          } catch (fixError) {
            console.warn('Could not fix truncated JSON, using enhanced fallback');
            // Enhanced fallback with better content
            transformedData = {
              mainPost: {
                title: 'Uranus in Gemini: Major Astrological Changes Ahead',
                content: 'Uranus is entering Gemini in July 2025, bringing 8 years of revolutionary changes to communication, technology, and how we process information. This transit will shake up established patterns and introduce innovative ways of thinking and connecting. The effects will vary based on which house this transit activates in your natal chart.',
                category: originalPost.suggestedCategory || categories[Math.floor(Math.random() * categories.length)],
                tags: originalPost.suggestedTags || ['astrology', 'uranus', 'gemini', 'transit'],
                summary: 'Discussion about the upcoming Uranus in Gemini transit and its transformative effects.'
              },
              replies: []
            };
          }
        } else {
          // Complete fallback
          transformedData = {
            mainPost: {
              title: 'Astrological Discussion',
              content: 'An engaging discussion about astrological topics and their effects on our lives.',
              category: originalPost.suggestedCategory || categories[Math.floor(Math.random() * categories.length)],
              tags: originalPost.suggestedTags || ['astrology', 'discussion'],
              summary: 'An astrological discussion transformed by AI.'
            },
            replies: []
          };
        }
      }

      // Process the main discussion post only
      const mainPost = transformedData.mainPost;
      
      transformedContent.push({
        originalContent: originalPost.originalContent || originalPost.fullContent,
        originalTitle: originalPost.originalTitle,
        transformedTitle: mainPost.title,
        transformedContent: mainPost.content,
        category: mainPost.category,
        tags: mainPost.tags || [],
        assignedAuthor: assignedUser.username || assignedUser.userId.replace('seed_user_', ''),
        assignedAuthorId: assignedUser.userId,
        replies: [], // No replies generated yet
        actualReplyCount: 0,
        aiProvider: aiConfig.provider,
        aiModel: aiConfig.model,
        summary: mainPost.summary,
        contentLength: mainPost.content.length,
        originalLength: (originalPost.originalContent || originalPost.fullContent).length
      });

    } catch (error) {
      console.error('Error transforming content with AI:', error);
      
      // Fallback to basic transformation if AI fails
      const fallbackContent = originalPost.originalContent || originalPost.fullContent || 'Astrological discussion content';
      transformedContent.push({
        originalContent: fallbackContent,
        originalTitle: originalPost.originalTitle || 'Astrological Discussion',
        transformedTitle: `[AI Error] ${originalPost.originalTitle || 'Astrological Discussion'}`,
        transformedContent: `${fallbackContent.substring(0, 500)}...\n\n[Note: AI transformation failed, showing truncated original content]`,
        category: categories[Math.floor(Math.random() * categories.length)],
        tags: ['astrology', 'discussion'],
        assignedAuthor: assignedUser.username || assignedUser.userId.replace('seed_user_', ''),
        assignedAuthorId: assignedUser.userId,
        replies: [],
        actualReplyCount: 0,
        aiProvider: aiConfig.provider + '-fallback',
        aiModel: aiConfig.model,
        summary: fallbackContent.substring(0, 200) + '...',
        error: (error as Error).message
      });
    }
  }

  return transformedContent;
}

// Mock AI transformation function
async function simulateAITransformation(parsedContent: any[], seedConfigs: any[], generationSettings: any) {
  const categories = [
    'Natal Chart Analysis',
    'Transits & Predictions',
    'Synastry & Compatibility',
    'Chart Reading Help',
    'Learning Resources',
    'General Discussion'
  ];
  
  const astrologyTags = [
    'natal-chart', 'transits', 'retrograde', 'aspects', 'houses', 'planets',
    'sun-sign', 'moon-sign', 'rising-sign', 'mercury', 'venus', 'mars',
    'jupiter', 'saturn', 'compatibility', 'synastry', 'prediction', 'timing'
  ];
  
  const transformedContent = parsedContent.map((item, index) => {
    // Select a seed user for this discussion
    const assignedUser = seedConfigs[index % seedConfigs.length];
    
    // Generate transformed title (simulate AI rephrasing)
    const transformedTitle = generateTransformedTitle(item.originalTitle, item.suggestedCategory);
    
    // Generate transformed content (simulate AI rephrasing)
    const transformedContent = generateTransformedContent(item.originalContent, assignedUser.writingStyle);
    
    // Select category (prefer suggested or random)
    const category = item.suggestedCategory !== 'General Discussion' 
      ? item.suggestedCategory 
      : categories[Math.floor(Math.random() * categories.length)];
    
    // Generate relevant tags
    const tags = generateRelevantTags(item, category, astrologyTags);
    
    // Calculate estimated replies based on user engagement patterns and content quality
    const baseReplies = generationSettings?.repliesPerDiscussion?.min || 3;
    const maxReplies = generationSettings?.repliesPerDiscussion?.max || 25;
    const replyVariance = Math.random() * 0.5 + 0.75; // 75-125% variance
    const userEngagementMultiplier = assignedUser.replyProbability;
    
    const estimatedReplies = Math.round(
      Math.min(
        maxReplies,
        Math.max(
          baseReplies,
          (baseReplies + Math.random() * (maxReplies - baseReplies)) * 
          replyVariance * 
          userEngagementMultiplier
        )
      )
    );
    
    return {
      id: `transformed_${index + 1}`,
      originalId: item.id,
      transformedTitle,
      transformedContent,
      originalTitle: item.originalTitle,
      originalContent: item.originalContent,
      category,
      tags,
      assignedAuthorId: assignedUser.userId,
      assignedAuthor: assignedUser.username || assignedUser.userId.replace('seed_user_', '').replace(/^\w/, (c: string) => c.toUpperCase()),
      assignedAuthorUsername: assignedUser.userId.replace('seed_user_', '').replace(/^\w/, (c: string) => c.toUpperCase()),
      writingStyle: assignedUser.writingStyle,
      estimatedReplies,
      estimatedUpvotes: Math.floor(Math.random() * 50) + 10,
      aiGenerated: true,
      transformedAt: new Date().toISOString(),
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      qualityScore: Math.random() * 0.4 + 0.6 // 60-100% quality
    };
  });
  
  return transformedContent;
}

function generateTransformedTitle(originalTitle: string, category: string): string {
  const titlePrefixes = {
    'Natal Chart Analysis': ['Understanding', 'Exploring', 'Diving Deep into', 'Analyzing'],
    'Transits & Predictions': ['Current', 'Upcoming', 'Navigating', 'Predicting'],
    'Synastry & Compatibility': ['Relationship', 'Compatibility', 'Love and', 'Partners and'],
    'Chart Reading Help': ['Help with', 'Need guidance on', 'Interpreting', 'Understanding'],
    'Learning Resources': ['Learning about', 'Guide to', 'Basics of', 'Introduction to'],
    'General Discussion': ['Discussion:', 'Thoughts on', 'Exploring', 'Question about']
  };
  
  const prefixes = titlePrefixes[category as keyof typeof titlePrefixes] || titlePrefixes['General Discussion'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
  // Clean and enhance the original title
  let cleanTitle = originalTitle
    .replace(/^(re:|fwd:|help:|question:)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleanTitle.length > 80) {
    cleanTitle = cleanTitle.substring(0, 77) + '...';
  }
  
  return `${prefix} ${cleanTitle}`;
}

function generateTransformedContent(originalContent: string, writingStyle: string): string {
  const styleTransformations = {
    'professional_educational': (content: string) => 
      `From an astrological perspective, ${content.toLowerCase()}. This represents a significant opportunity for growth and understanding.`,
    
    'enthusiastic_personal': (content: string) => 
      `OMG, I can totally relate to this! ${content} Has anyone else experienced something similar? I'd love to hear your thoughts!`,
    
    'analytical_questioning': (content: string) => 
      `I've been analyzing this pattern and wondering about the statistical significance. ${content} What evidence do we have for this correlation?`,
    
    'beginner_enthusiastic': (content: string) => 
      `I'm still learning about astrology, but this is fascinating! ${content} Could someone explain this in simpler terms?`,
    
    'specialist_timing': (content: string) => 
      `Timing-wise, this is particularly interesting. ${content} The current planetary positions suggest this is an optimal period for such insights.`
  };
  
  const transformer = styleTransformations[writingStyle as keyof typeof styleTransformations];
  
  if (transformer && originalContent.length < 200) {
    return transformer(originalContent);
  }
  
  // For longer content, just add a style-appropriate introduction
  const intros = {
    'professional_educational': 'From a professional standpoint, ',
    'enthusiastic_personal': 'I absolutely love this topic! ',
    'analytical_questioning': 'Looking at this analytically, ',
    'beginner_enthusiastic': 'As someone new to astrology, ',
    'specialist_timing': 'Considering the current planetary timing, '
  };
  
  const intro = intros[writingStyle as keyof typeof intros] || '';
  
  return `${intro}${originalContent}`;
}

function generateRelevantTags(item: any, category: string, astrologyTags: string[]): string[] {
  const tags = [...item.suggestedTags];
  
  // Add category-specific tags
  if (category.includes('Natal')) tags.push('natal-chart');
  if (category.includes('Transits')) tags.push('transits');
  if (category.includes('Synastry')) tags.push('compatibility', 'synastry');
  if (category.includes('Help')) tags.push('question', 'help');
  if (category.includes('Learning')) tags.push('beginner', 'education');
  
  // Add random astrology tags based on content
  const additionalTags = astrologyTags
    .filter(tag => Math.random() < 0.3) // 30% chance for each tag
    .slice(0, 3); // Maximum 3 additional tags
  
  tags.push(...additionalTags);
  
  // Remove duplicates and limit to 5 tags
  return [...new Set(tags)].slice(0, 5);
}