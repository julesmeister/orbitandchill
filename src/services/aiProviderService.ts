/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  AIConfig, 
  AIProviderResponse, 
  DiscussionData, 
  SeedUserConfig, 
  GeneratedReply,
  ReplyTemplate,
  WritingStyle 
} from '@/types/replyGeneration';
import { PersonalityService } from './personalityService';
import { MoodService } from './moodService';
import { SchedulingService } from './schedulingService';
import { HumanizationService } from './humanizationService';

export class AIProviderService {
  static async generateReply(
    discussionData: DiscussionData,
    selectedUser: SeedUserConfig,
    aiConfig: AIConfig,
    selectedMood: string,
    timingConfig: any = null
  ): Promise<GeneratedReply> {
    if (aiConfig.provider === 'deepseek' || aiConfig.provider === 'openrouter') {
      return this.generateReplyWithAI(discussionData, selectedUser, aiConfig, selectedMood, timingConfig);
    } else {
      return this.generateMockReply(discussionData, selectedUser, selectedMood, timingConfig);
    }
  }

  private static async generateReplyWithAI(
    discussionData: DiscussionData,
    selectedUser: SeedUserConfig,
    aiConfig: AIConfig,
    selectedMood: string,
    timingConfig: any
  ): Promise<GeneratedReply> {
    const existingReplies = discussionData.replies || [];
    const existingContent = existingReplies.map((r: any) => r.content).join('\n\n');

    const personalityDetails = PersonalityService.getPersonalityDetails(selectedUser);
    const systemPrompt = MoodService.generateSystemPrompt(selectedUser.username, personalityDetails, selectedMood);
    const userPrompt = MoodService.generateUserPrompt(
      discussionData.transformedTitle, 
      existingContent, 
      selectedMood, 
      selectedUser.username
    );

    const modelToUse = aiConfig.model || 'deepseek/deepseek-r1-distill-llama-70b:free';
    
    console.log('🤖 Using AI model for reply generation:', modelToUse);
    console.log('🤖 Full aiConfig received:', aiConfig);
    
    // Check for deprecated model
    if (modelToUse === 'meta-llama/llama-3.1-70b-instruct:free') {
      console.error('🚨 DETECTED OLD MODEL! This model is no longer available.');
      throw new Error('Detected deprecated model meta-llama/llama-3.1-70b-instruct:free. Please update your AI configuration.');
    }

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
        max_tokens: 100,
        stop: ["}", "\n\n"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error response:', errorText);
      
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

    const result: AIProviderResponse = await response.json();
    console.log('Full AI response:', JSON.stringify(result, null, 2));
    
    let aiOutput = result.choices?.[0]?.message?.content;
    const reasoning = result.choices?.[0]?.message?.reasoning;
    const finishReason = result.choices?.[0]?.finish_reason;

    // Handle reasoning extraction if content is empty
    if (!aiOutput && reasoning) {
      aiOutput = this.extractFromReasoning(reasoning) || undefined;
    }

    // Handle empty or truncated responses
    if (!aiOutput || aiOutput.length < 5) {
      console.warn('AI returned empty/short content, falling back to mock reply');
      return this.generateMockReply(discussionData, selectedUser, selectedMood, timingConfig);
    }

    let replyContent = this.parseAIResponse(aiOutput);
    
    // Apply humanization to make the reply sound more natural
    const humanizationIntensity = HumanizationService.getIntensityForStyle(selectedUser.writingStyle);
    replyContent = HumanizationService.humanizeText(replyContent, humanizationIntensity);
    
    return this.createReplyObject(
      selectedUser, 
      replyContent, 
      selectedMood, 
      discussionData, 
      timingConfig
    );
  }

  private static extractFromReasoning(reasoning: string): string | null {
    console.log('Content empty, trying to extract from reasoning:', reasoning);
    
    // Try to find JSON in the reasoning
    const jsonMatch = reasoning.match(/\{[^}]*"content"[^}]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.content) {
          console.log('Extracted from reasoning:', JSON.stringify(parsed));
          return JSON.stringify(parsed);
        }
      } catch (e) {
        console.warn('Could not parse JSON from reasoning');
      }
    }
    
    // Try to extract actual reply content from reasoning using patterns
    const quotePatterns = [
      /"([^"]{15,100}[.!?])"/,  // Quoted sentences
      /'([^']{15,100}[.!?])'/,  // Single quoted sentences
      /reply.*?[:"]s*([^.!?]{15,100}[.!?])/i,  // After "reply:"
      /response.*?[:"]s*([^.!?]{15,100}[.!?])/i,  // After "response:"
      /would say.*?[:"]s*([^.!?]{15,100}[.!?])/i,  // After "would say:"
      /something like.*?[:"]s*([^.!?]{15,100}[.!?])/i,  // After "something like:"
    ];
    
    for (const pattern of quotePatterns) {
      const match = reasoning.match(pattern);
      if (match && match[1]) {
        console.log('Extracted reply from reasoning pattern:', match[1].trim());
        return match[1].trim();
      }
    }

    return null;
  }

  private static parseAIResponse(aiOutput: string): string {
    let replyContent = '';
    
    try {
      console.log('Raw AI output for parsing:', aiOutput);
      
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

    return replyContent || "This is really interesting!";
  }

  static generateMockReply(
    discussionData: DiscussionData,
    selectedUser: SeedUserConfig,
    selectedMood: string,
    timingConfig: any = null
  ): GeneratedReply {
    const existingReplies = discussionData.replies || [];
    const usedContent = new Set(existingReplies.map((r: any) => r.content));
    
    const replyTemplates: ReplyTemplate = {
      'professional_educational': [
        "honestly this aligns really well with what ive seen in charts over the years ✨",
        "yep this is pretty much textbook for how these transits work... seen it so many times",
        "from my experiance this usually means big changes comming, like major ones",
        "the timing here is pretty intresting ngl, especially with everything else happening",
        "ive noticed similar patterns with clients lately... somthing is definitely shifting",
        "this resonates with traditional interpretations but teh modern twist is spot on",
        "wait no actually... this reminds me of what we saw in 2019 with similar aspects",
        "tbh ive been seeing this exact pattern show up in readings lately and its... wow",
        "ngl this is giving me flashbacks to my astro mentor who always said...",
        "the correlation here is undeniable but i mean... timing could be coincidence? idk"
      ],
      'enthusiastic_personal': [
        "omg YES this is literally my life right now!! 😍✨",
        "wait this gave me actual chills... explains so much about whats been hapening",
        "YESSS finally someone said it!! this resonates so freaking hard",
        "this gives me hope tbh... been feeling this energy shift too 💫",
        "the timing of seeing this post tho... universe is speaking fr",
        "im totally feeling this!! like everything is clicking into place",
        "this is so spot on its scary... been noticing these changes recntly",
        "literally crying rn bc this explains everything ive been going thru 😭",
        "wait hold up... this is exactly what my friend was telling me about!!",
        "OMG stop it this is too accurate... like how did you even know??",
        "im shook ngl... this post just changed my whole perspective on everything"
      ],
      'analytical_questioning': [
        "this is interesting but tbh id love to see some data backing this up 🤔",
        "the correlation seems real but whats the sample size here?",
        "ngl this warants more investigation... curious about the methodology",
        "would be more convincing with proper controls but still intriguing",
        "skeptical part of me wants peer review but the patterns are there 📊",
        "data scientist in me needs more proof but... this has been accurate in my life",
        "wait how do we account for confirmation bias tho? like genuinely curious",
        "this is fascinating but i keep wondering about the statistical significance...",
        "not trying to be a buzzkill but shouldnt we consider alternative explanations?",
        "the cynic in me wants more evidence but ngl the timing is too perfect to ignore"
      ],
      'beginner_enthusiastic': [
        "wait im still learning but this makes SO much sense!! 🌙",
        "omg as someone new to this... this is absolutley mind blowing",
        "thank u for explaining this so clearly!! super helpful for newbies like me",
        "im a total newbie but this is blowing my mind rn 🥺",
        "this is so cool!! never realised astrology was this detailed",
        "just starting my astro journy and this is exactly what i needed ✨",
        "learning so much from posts like this... keep them comming pls!",
        "ok wait so like... does this mean what i think it means? 👀",
        "sorry if this is a dumb question but how does this relate to my chart?",
        "this is making me want to dive so much deeper into all of this stuff",
        "wait no im confused... can someone explain this in simple terms? 😅"
      ],
      'specialist_timing': [
        "the timing of this is pretty wild actually... especially right now",
        "considering current planetary stuff this timing is... interesting",
        "given whats happening astrologicaly this message hits different",
        "ngl the timing for this discussion is kinda perfect...",
        "this aligns with the current lunar phase were in... intresting",
        "perfect timing considering mercury retrograde and everything 🙃",
        "the cosmic timing of this is... honestly pretty wild",
        "i mean the fact that this showed up now when mars is doing its thing...",
        "timing wise this couldnt be more relevant with whats happening in the sky rn",
        "the universe really said 'lets drop this bomb today' huh? 💣",
        "ok but seriously the synchronicity here is giving me goosebumps..."
      ]
    };
    
    const templates = replyTemplates[selectedUser.writingStyle] || replyTemplates.enthusiastic_personal;
    
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
      const baseTemplate = templates[0];
      const suffixes = [
        "Definitely worth exploring further!", 
        "Looking forward to more insights!", 
        "Thanks for bringing this up!", 
        "This opens up so many possibilities!"
      ];
      content = `${baseTemplate} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    }
    
    // Apply humanization to mock replies too
    const humanizationIntensity = HumanizationService.getIntensityForStyle(selectedUser.writingStyle);
    content = HumanizationService.humanizeText(content, humanizationIntensity);
    
    return this.createReplyObject(selectedUser, content, selectedMood, discussionData, timingConfig);
  }

  private static createReplyObject(
    selectedUser: SeedUserConfig,
    content: string,
    selectedMood: string,
    discussionData: DiscussionData,
    timingConfig: any
  ): GeneratedReply {
    const schedulingInfo = SchedulingService.calculateScheduledTimestamp(
      timingConfig, 
      discussionData.createdAt || new Date().toISOString()
    );
    
    const uniqueId = `reply_${Date.now()}_${performance.now().toString().replace('.', '')}_${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      id: uniqueId,
      content,
      authorName: selectedUser.username,
      authorId: selectedUser.userId,
      avatar: selectedUser.profilePictureUrl || '/avatars/default.png',
      timestamp: schedulingInfo.timestamp,
      createdAt: schedulingInfo.timestamp,
      scheduledDelay: schedulingInfo.scheduledDelay,
      upvotes: Math.floor(Math.random() * 15) + 1,
      downvotes: Math.floor(Math.random() * 3),
      reactionType: selectedMood || 'supportive',
      addingValue: 'Contributing to the discussion',
      aiGenerated: true,
      writingStyle: selectedUser.writingStyle,
      userExpertise: selectedUser.expertiseAreas,
      contentHash: Buffer.from(content).toString('base64').substring(0, 10)
    };
  }
}