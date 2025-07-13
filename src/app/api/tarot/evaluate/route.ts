/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

interface EvaluateRequest {
  userId: string;
  cardId: string;
  cardOrientation: 'upright' | 'reversed';
  situation: string;
  interpretation: string;
  cardMeaning: string;
  cardKeywords: string[];
  aiConfig?: {
    provider: string;
    model: string;
    apiKey: string;
    temperature: number;
  };
}

interface EvaluationResult {
  score: number;
  feedback: string;
  accuracyRating: 'excellent' | 'good' | 'fair' | 'needs_improvement';
  keywordAccuracy: number;
  contextRelevance: number;
  traditionalAlignment: number;
  creativityBonus: number;
  strengthsIdentified: string[];
  improvementAreas: string[];
  recommendedStudy: string[];
}

// Use AI to generate evaluation and sample interpretation
async function generateAIEvaluation(
  userInterpretation: string,
  cardMeaning: string,
  cardKeywords: string[],
  situation: string,
  aiConfig?: any
): Promise<{ score: number; feedback: string; sampleInterpretation: string }> {
  
  if (!aiConfig || !aiConfig.apiKey) {
    console.log('No AI config provided, using fallback evaluation');
    return generateBasicEvaluation(userInterpretation, cardMeaning, cardKeywords, situation);
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tarot/ai-evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userInterpretation,
        cardMeaning,
        cardKeywords,
        situation,
        aiConfig
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        return {
          score: result.score,
          feedback: result.feedback,
          sampleInterpretation: result.sampleInterpretation
        };
      }
    }
  } catch (error) {
    console.error('AI evaluation API failed:', error);
  }
  
  // Fallback to basic evaluation
  console.log('AI evaluation failed, using fallback evaluation');
  return generateBasicEvaluation(userInterpretation, cardMeaning, cardKeywords, situation);
}

// Fallback evaluation when AI is unavailable
function generateBasicEvaluation(
  interpretation: string,
  cardMeaning: string,
  cardKeywords: string[],
  situation: string
): { score: number; feedback: string; sampleInterpretation: string } {
  
  // Simple scoring based on keyword presence and length
  const interpretationLower = interpretation.toLowerCase();
  const keywordMatches = cardKeywords.filter(keyword => 
    interpretationLower.includes(keyword.toLowerCase())
  ).length;
  
  const baseScore = Math.min((keywordMatches / cardKeywords.length) * 60 + 20, 80);
  const lengthBonus = Math.min(interpretation.length / 200 * 20, 20);
  const score = Math.round(baseScore + lengthBonus);

  let feedback = `You scored ${score} points. `;
  if (score >= 70) {
    feedback += 'Good work! Your interpretation shows understanding of the card.';
  } else if (score >= 50) {
    feedback += 'Fair interpretation. Try incorporating more traditional keywords.';
  } else {
    feedback += 'Keep practicing! Focus on the traditional meanings and keywords.';
  }

  const sampleInterpretation = generateFallbackSample(cardMeaning, cardKeywords, situation);

  return {
    score,
    feedback,
    sampleInterpretation
  };
}

// Simple fallback sample when AI fails
function generateFallbackSample(cardMeaning: string, cardKeywords: string[], situation: string): string {
  const keywords = cardKeywords.slice(0, 3);
  const context = extractSituationContext(situation);
  
  return `In ${context}, this card suggests ${cardMeaning.toLowerCase()}. The energy of ${keywords[0]} indicates a time for ${keywords[1]} and ${keywords[2]}. Consider embracing these themes as guidance for moving forward with wisdom and clarity.`;
}

function extractSituationContext(situation: string): string {
  if (situation.toLowerCase().includes('career') || situation.toLowerCase().includes('job') || situation.toLowerCase().includes('work')) {
    return 'this career situation';
  } else if (situation.toLowerCase().includes('relationship') || situation.toLowerCase().includes('partner') || situation.toLowerCase().includes('love')) {
    return 'this relationship matter';
  } else if (situation.toLowerCase().includes('family') || situation.toLowerCase().includes('parent') || situation.toLowerCase().includes('sibling')) {
    return 'this family dynamic';
  } else if (situation.toLowerCase().includes('financial') || situation.toLowerCase().includes('money') || situation.toLowerCase().includes('investment')) {
    return 'this financial decision';
  } else {
    return 'this life situation';
  }
}


// Simple AI evaluation logic (to be enhanced with external AI service)
function evaluateInterpretation(
  interpretation: string,
  cardMeaning: string,
  cardKeywords: string[],
  situation: string
): EvaluationResult {
  const interpretationLower = interpretation.toLowerCase();
  const cardMeaningLower = cardMeaning.toLowerCase();
  
  // Keyword accuracy - how many card keywords are mentioned
  const keywordMatches = cardKeywords.filter(keyword => 
    interpretationLower.includes(keyword.toLowerCase())
  ).length;
  const keywordAccuracy = Math.min(keywordMatches / Math.max(cardKeywords.length * 0.5, 1), 1);
  
  // Traditional alignment - how well interpretation matches traditional meaning
  const meaningWords = cardMeaningLower.split(' ');
  const interpretationWords = interpretationLower.split(' ');
  const meaningMatches = meaningWords.filter(word => 
    word.length > 3 && interpretationWords.some(iWord => 
      iWord.includes(word) || word.includes(iWord)
    )
  ).length;
  const traditionalAlignment = Math.min(meaningMatches / Math.max(meaningWords.length * 0.3, 1), 1);
  
  // Context relevance - mentions situation-relevant concepts
  const situationWords = situation.toLowerCase().split(' ');
  const contextMatches = situationWords.filter(word => 
    word.length > 4 && interpretationLower.includes(word)
  ).length;
  const contextRelevance = Math.min(contextMatches / Math.max(situationWords.length * 0.2, 1), 1);
  
  // Creativity bonus - longer, more detailed interpretations
  const creativityBonus = Math.min(interpretation.length / 200, 0.3);
  
  // Calculate overall score (0-100)
  const baseScore = (keywordAccuracy * 0.3 + traditionalAlignment * 0.4 + contextRelevance * 0.3) * 100;
  const finalScore = Math.min(Math.round(baseScore + (creativityBonus * 20)), 100);
  
  // Determine accuracy rating
  let accuracyRating: 'excellent' | 'good' | 'fair' | 'needs_improvement';
  if (finalScore >= 85) accuracyRating = 'excellent';
  else if (finalScore >= 70) accuracyRating = 'good';
  else if (finalScore >= 55) accuracyRating = 'fair';
  else accuracyRating = 'needs_improvement';
  
  // Generate feedback
  const strengths: string[] = [];
  const improvements: string[] = [];
  const study: string[] = [];
  
  if (keywordAccuracy > 0.6) {
    strengths.push('Good use of traditional tarot keywords');
  } else {
    improvements.push('Try incorporating more traditional tarot keywords');
    study.push('Review the key meanings and symbols of this card');
  }
  
  if (traditionalAlignment > 0.7) {
    strengths.push('Strong alignment with traditional card meanings');
  } else {
    improvements.push('Focus more on the traditional meanings of the card');
    study.push('Study classic tarot interpretations for this card');
  }
  
  if (contextRelevance > 0.6) {
    strengths.push('Good application of card meaning to the specific situation');
  } else {
    improvements.push('Try to connect the card more directly to the given situation');
    study.push('Practice relating card meanings to real-life scenarios');
  }
  
  if (interpretation.length > 150) {
    strengths.push('Detailed and thoughtful interpretation');
  } else {
    improvements.push('Consider providing more detailed explanations');
    study.push('Practice writing comprehensive card interpretations');
  }
  
  let feedback = `You scored ${finalScore} points. `;
  
  if (finalScore >= 85) {
    feedback += 'Excellent work! Your interpretation shows deep understanding.\n\n';
  } else if (finalScore >= 70) {
    feedback += 'Good interpretation with solid grasp of the card\'s meaning.\n\n';
  } else if (finalScore >= 55) {
    feedback += 'Fair interpretation - you\'re on the right track.\n\n';
  } else {
    feedback += 'This is a learning opportunity - here\'s how to approach it:\n\n';
  }
  
  // Add sample interpretation
  const sampleInterpretation = generateFallbackSample(cardMeaning, cardKeywords, situation);
  feedback += `SAMPLE INTERPRETATION:\n${sampleInterpretation}\n\n`;
  
  feedback += `TRADITIONAL MEANING: ${cardMeaning}\n\n`;
  
  if (strengths.length > 0) {
    feedback += `STRENGTHS: ${strengths.join(', ')}\n\n`;
  }
  
  if (improvements.length > 0) {
    feedback += `AREAS TO DEVELOP: ${improvements.join(', ')}`;
  }
  
  return {
    score: finalScore,
    feedback,
    accuracyRating,
    keywordAccuracy,
    contextRelevance,
    traditionalAlignment,
    creativityBonus,
    strengthsIdentified: strengths,
    improvementAreas: improvements,
    recommendedStudy: study
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: EvaluateRequest = await request.json();
    const { userId, cardId, cardOrientation, situation, interpretation, cardMeaning, cardKeywords, aiConfig } = body;

    if (!userId || !cardId || !interpretation) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use AI to evaluate the interpretation
    const aiEvaluation = await generateAIEvaluation(interpretation, cardMeaning, cardKeywords, situation, aiConfig);
    
    // Create evaluation result with AI feedback
    const evaluation: EvaluationResult = {
      score: aiEvaluation.score,
      feedback: `${aiEvaluation.feedback}\n\nEXPERT EXAMPLE:\n${aiEvaluation.sampleInterpretation}\n\nTRADITIONAL MEANING:\n${cardMeaning}`,
      accuracyRating: aiEvaluation.score >= 85 ? 'excellent' : aiEvaluation.score >= 70 ? 'good' : aiEvaluation.score >= 55 ? 'fair' : 'needs_improvement',
      keywordAccuracy: 0, // Not used with AI evaluation
      contextRelevance: 0, // Not used with AI evaluation
      traditionalAlignment: 0, // Not used with AI evaluation
      creativityBonus: 0, // Not used with AI evaluation
      strengthsIdentified: [],
      improvementAreas: [],
      recommendedStudy: []
    };

    // Save session to database
    try {
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (databaseUrl && authToken) {
        const client = createClient({
          url: databaseUrl,
          authToken: authToken,
        });

        const sessionId = `tarot_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date();

        // Insert session record with orientation tracking
        await client.execute({
          sql: `INSERT INTO tarot_sessions (
            id, user_id, card_id, situation, user_interpretation, ai_evaluation,
            score, accuracy_rating, keyword_accuracy, context_relevance, 
            traditional_alignment, creativity_bonus, strengths_identified,
            improvement_areas, recommended_study, session_type, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            sessionId,
            userId,
            `${cardId}_${cardOrientation}`, // Include orientation in card tracking
            situation,
            interpretation,
            evaluation.feedback,
            evaluation.score,
            evaluation.accuracyRating,
            evaluation.keywordAccuracy,
            evaluation.contextRelevance,
            evaluation.traditionalAlignment,
            evaluation.creativityBonus,
            JSON.stringify(evaluation.strengthsIdentified),
            JSON.stringify(evaluation.improvementAreas),
            JSON.stringify(evaluation.recommendedStudy),
            'practice',
            now.toISOString()
          ]
        });

        // Update or create progress record
        console.log('Querying tarot_progress for user:', userId, 'card:', cardId);
        const progressResult = await client.execute({
          sql: 'SELECT * FROM tarot_progress WHERE user_id = ? AND card_id = ?',
          args: [userId, cardId]
        });
        console.log('Progress query result:', progressResult.rows.length, 'rows found');
        
        // Check table structure to see what columns actually exist
        try {
          const schemaResult = await client.execute({
            sql: 'PRAGMA table_info(tarot_progress)',
            args: []
          });
          console.log('tarot_progress table columns:', schemaResult.rows.map((row: any) => row.name));
        } catch (schemaError) {
          console.log('Could not get table schema:', schemaError);
        }

        const isCorrect = evaluation.score >= 70; // Consider 70+ as "correct"
        
        if (progressResult.rows.length > 0) {
          // Update existing progress with orientation tracking
          const progress = progressResult.rows[0] as any;
          const newTotalAttempts = (progress.total_attempts || 0) + 1;
          const newTotalScore = (progress.total_score || 0) + evaluation.score;
          const newAverageScore = newTotalScore / newTotalAttempts;
          
          // Update orientation-specific stats
          let newUprightAttempts = progress.upright_attempts || 0;
          let newUprightScore = progress.upright_score || 0;
          let newReversedAttempts = progress.reversed_attempts || 0;
          let newReversedScore = progress.reversed_score || 0;
          
          if (cardOrientation === 'upright') {
            newUprightAttempts += 1;
            newUprightScore += evaluation.score;
          } else {
            newReversedAttempts += 1;
            newReversedScore += evaluation.score;
          }
          
          const newUprightAverage = newUprightAttempts > 0 ? newUprightScore / newUprightAttempts : 0;
          const newReversedAverage = newReversedAttempts > 0 ? newReversedScore / newReversedAttempts : 0;
          
          // Calculate mastery percentage based on recent performance
          const masteryPercentage = Math.min((newAverageScore / 100) * 100, 100);
          
          // Determine familiarity level based on total points (match tarot.md 5-level system)
          let familiarityLevel = 'novice';
          if (newTotalScore >= 25000) familiarityLevel = 'grandmaster';
          else if (newTotalScore >= 10000) familiarityLevel = 'master';
          else if (newTotalScore >= 5000) familiarityLevel = 'adept';
          else if (newTotalScore >= 1000) familiarityLevel = 'apprentice';

          console.log('Updating progress with orientation tracking:', {
            cardOrientation,
            newTotalAttempts, newTotalScore, newAverageScore, masteryPercentage, familiarityLevel,
            newUprightAttempts, newUprightAverage, newReversedAttempts, newReversedAverage
          });

          const newBestScore = Math.max(progress.best_score || 0, evaluation.score);

          await client.execute({
            sql: `UPDATE tarot_progress SET 
              total_attempts = ?, total_score = ?,
              average_score = ?, best_score = ?, mastery_percentage = ?,
              upright_attempts = ?, upright_score = ?, upright_average = ?,
              reversed_attempts = ?, reversed_score = ?, reversed_average = ?,
              familiarity_level = ?, last_attempt_date = ?, last_played = ?, updated_at = ?
              WHERE user_id = ? AND card_id = ?`,
            args: [
              newTotalAttempts, newTotalScore,
              newAverageScore, newBestScore, masteryPercentage,
              newUprightAttempts, newUprightScore, newUprightAverage,
              newReversedAttempts, newReversedScore, newReversedAverage,
              familiarityLevel, now.toISOString(), now.toISOString(), now.toISOString(),
              userId, cardId
            ]
          });
          console.log('Progress updated successfully with orientation tracking');
        } else {
          // Create new progress record with orientation tracking
          const progressId = `tarot_progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const masteryPercentage = Math.min((evaluation.score / 100) * 100, 100);
          
          // Initialize orientation-specific stats
          const uprightAttempts = cardOrientation === 'upright' ? 1 : 0;
          const uprightScore = cardOrientation === 'upright' ? evaluation.score : 0;
          const uprightAverage = cardOrientation === 'upright' ? evaluation.score : 0;
          const reversedAttempts = cardOrientation === 'reversed' ? 1 : 0;
          const reversedScore = cardOrientation === 'reversed' ? evaluation.score : 0;
          const reversedAverage = cardOrientation === 'reversed' ? evaluation.score : 0;
          
          let familiarityLevel = 'novice';
          if (evaluation.score >= 25000) familiarityLevel = 'grandmaster';
          else if (evaluation.score >= 10000) familiarityLevel = 'master';
          else if (evaluation.score >= 5000) familiarityLevel = 'adept';
          else if (evaluation.score >= 1000) familiarityLevel = 'apprentice';

          console.log('Creating new progress record with orientation tracking:', {
            progressId, userId, cardId, cardOrientation, score: evaluation.score, masteryPercentage, familiarityLevel,
            uprightAttempts, uprightAverage, reversedAttempts, reversedAverage
          });

          await client.execute({
            sql: `INSERT INTO tarot_progress (
              id, user_id, card_id, total_attempts,
              total_score, average_score, best_score, mastery_percentage,
              upright_attempts, upright_score, upright_average,
              reversed_attempts, reversed_score, reversed_average,
              familiarity_level, last_attempt_date, last_played, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              progressId, userId, cardId, 1,
              evaluation.score, evaluation.score, evaluation.score, masteryPercentage,
              uprightAttempts, uprightScore, uprightAverage,
              reversedAttempts, reversedScore, reversedAverage,
              familiarityLevel, now.toISOString(), now.toISOString(), 
              now.toISOString(), now.toISOString()
            ]
          });
          console.log('New progress record created successfully with orientation tracking');
        }

        // Update leaderboard
        console.log('Checking leaderboard for userId:', userId);
        const leaderboardResult = await client.execute({
          sql: 'SELECT * FROM tarot_leaderboard WHERE user_id = ?',
          args: [userId]
        });
        console.log('Leaderboard query result:', leaderboardResult.rows.length, 'rows found');
        if (leaderboardResult.rows.length > 0) {
          console.log('Existing leaderboard data:', leaderboardResult.rows[0]);
        }
        
        // Check leaderboard table structure
        try {
          const leaderboardSchemaResult = await client.execute({
            sql: 'PRAGMA table_info(tarot_leaderboard)',
            args: []
          });
          console.log('tarot_leaderboard table columns:', leaderboardSchemaResult.rows.map((row: any) => row.name));
        } catch (schemaError) {
          console.log('Could not get leaderboard table schema:', schemaError);
        }

        // Get username for leaderboard - try multiple possible sources
        let username = 'Anonymous';
        
        try {
          // Try users table first - check what columns actually exist
          const userResult = await client.execute({
            sql: 'SELECT * FROM users WHERE id = ? LIMIT 1',
            args: [userId]
          });
          
          if (userResult.rows.length > 0) {
            const userRow = userResult.rows[0] as any;
            username = userRow.username || userRow.name || userRow.email || 'Anonymous';
          } else {
            // If not in users table, try seed_users table
            const seedUserResult = await client.execute({
              sql: 'SELECT * FROM seed_users WHERE id = ? LIMIT 1',
              args: [userId]
            });
            
            if (seedUserResult.rows.length > 0) {
              const seedUserRow = seedUserResult.rows[0] as any;
              username = seedUserRow.username || seedUserRow.name || 'Anonymous';
            } else {
              // Use user ID as fallback
              username = `User ${userId.slice(-6)}`;
            }
          }
        } catch (userLookupError) {
          console.warn('Username lookup failed, using fallback:', userLookupError);
          username = `User ${userId.slice(-6)}`;
        }

        if (leaderboardResult.rows.length > 0) {
          // Update existing leaderboard entry
          console.log('Updating existing leaderboard entry for user:', userId);
          const leaderboard = leaderboardResult.rows[0] as any;
          const newTotalScore = (leaderboard.total_score || 0) + evaluation.score;
          const newGamesPlayed = (leaderboard.games_played || 0) + 1;
          const newCardsCompleted = (leaderboard.cards_completed || 0) + 1;
          const newPerfectInterpretations = (leaderboard.perfect_interpretations || 0) + (evaluation.score === 100 ? 1 : 0);
          
          // Calculate new average score
          const newAverageScore = newTotalScore / newGamesPlayed;

          console.log('Leaderboard update data:', {
            userId,
            oldTotalScore: leaderboard.total_score,
            newTotalScore,
            oldGamesPlayed: leaderboard.games_played,
            newGamesPlayed,
            oldCardsCompleted: leaderboard.cards_completed,
            newCardsCompleted,
            evaluation_score: evaluation.score,
            newAverageScore,
            newPerfectInterpretations
          });

          await client.execute({
            sql: `UPDATE tarot_leaderboard SET 
              total_score = ?, games_played = ?, cards_completed = ?,
              average_score = ?, overall_accuracy = ?, perfect_interpretations = ?,
              last_played = ?, updated_at = ?
              WHERE user_id = ?`,
            args: [
              newTotalScore, newGamesPlayed, newCardsCompleted,
              newAverageScore, (newAverageScore / 100) * 100, newPerfectInterpretations,
              now.toISOString(), now.toISOString(), userId
            ]
          });
          console.log('Leaderboard updated successfully');
        } else {
          // Create new leaderboard entry
          console.log('Creating new leaderboard entry for user:', userId, 'with score:', evaluation.score);
          const leaderboardId = `tarot_leaderboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          await client.execute({
            sql: `INSERT INTO tarot_leaderboard (
              id, user_id, username, total_score, cards_completed, games_played,
              average_score, overall_accuracy, perfect_interpretations,
              last_played, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              leaderboardId, userId, username, evaluation.score, 1, 1,
              evaluation.score, (evaluation.score / 100) * 100, evaluation.score === 100 ? 1 : 0,
              now.toISOString(), now.toISOString(), now.toISOString()
            ]
          });
          console.log('New leaderboard entry created successfully');
        }
      }
    } catch (dbError) {
      console.error('Database save failed:', dbError);
      // Continue and return evaluation even if database save fails
    }

    return NextResponse.json({
      success: true,
      ...evaluation
    });

  } catch (error) {
    console.error('Tarot evaluation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}