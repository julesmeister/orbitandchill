/* eslint-disable @typescript-eslint/no-unused-vars */
import { MoodType } from '@/types/replyGeneration';

export class MoodService {
  private static moodMap = {
    'supportive': 'Be encouraging and uplifting. Share how the topic resonates positively with your experience. Use warm, affirming language.',
    'questioning': 'Be curious and analytical. Ask thoughtful questions or express genuine wonder about the topic. Share your confusion or desire to understand better.',
    'excited': 'Be enthusiastic and energetic! Share your excitement or how the topic amazes you. Use exclamation points and energetic language.',
    'wise': 'Be calm and insightful. Share deeper understanding or gentle guidance. Use thoughtful, measured language.',
    'concerned': 'Express worry or caution about the topic. Share your concerns or hesitations. Use careful, protective language.',
    'empathetic': 'Be understanding and caring. Share how you relate to others\' experiences. Use compassionate, connecting language.'
  };

  static getMoodInstructions(mood: string): string {
    return this.moodMap[mood as MoodType] || this.moodMap['supportive'];
  }

  static generateSystemPrompt(
    username: string, 
    personalityDetails: any, 
    selectedMood: string
  ): string {
    const moodInstructions = this.getMoodInstructions(selectedMood);
    
    return `You are ${username}, a real person typing quickly on an astrology forum. 

PERSONALITY: ${personalityDetails.personality}
BACKGROUND: ${personalityDetails.background}
REPLY STYLE: ${personalityDetails.replyStyle}

🎭 CRITICAL MOOD REQUIREMENT: ${selectedMood.toUpperCase()}
${moodInstructions}

Your task is to write a single, authentic forum reply that MUST match the ${selectedMood} mood EXACTLY.

REPLY REQUIREMENTS:
- Write as ${username} would naturally type
- MANDATORY: Match the ${selectedMood} emotional tone exactly - this is the most important requirement
- Use casual internet typing style (lowercase, missing punctuation, etc.)
- Keep it 1-3 sentences maximum
- Include natural typing imperfections

${selectedMood === 'questioning' ? '🔍 QUESTIONING MOOD: You MUST ask questions, express curiosity, or wonder about the topic. Use "?" marks, phrases like "wait", "how", "why", "I wonder", etc.' : ''}
${selectedMood === 'excited' ? '✨ EXCITED MOOD: You MUST show enthusiasm with exclamation points, energetic language, and positive excitement.' : ''}
${selectedMood === 'concerned' ? '⚠️ CONCERNED MOOD: You MUST express worry, caution, or hesitation about the topic.' : ''}
${selectedMood === 'wise' ? '🧙 WISE MOOD: You MUST be thoughtful, measured, and share deeper insights or gentle guidance.' : ''}
${selectedMood === 'empathetic' ? '🤗 EMPATHETIC MOOD: You MUST show understanding, relate to others, and use compassionate language.' : ''}

IMPORTANT: Respond with ONLY the reply text itself, nothing else. Do not include JSON formatting, explanations, or meta-commentary. Just write the actual reply as ${username} would type it.`;
  }

  static generateUserPrompt(
    discussionTitle: string, 
    existingContent: string, 
    selectedMood: string, 
    username: string
  ): string {
    return `Topic: "${discussionTitle}"

${existingContent ? `Avoid repeating: ${existingContent.substring(0, 200)}...` : ''}

Write your ${selectedMood} reply as ${username}:`;
  }

  static validateMood(mood?: string): string {
    const validMoods: MoodType[] = ['supportive', 'questioning', 'excited', 'wise', 'concerned', 'empathetic'];
    
    if (!mood || !validMoods.includes(mood as MoodType)) {
      return 'supportive';
    }
    
    return mood;
  }
}