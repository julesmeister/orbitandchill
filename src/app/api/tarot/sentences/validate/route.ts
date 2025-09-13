import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(request: NextRequest) {
  try {
    console.log('Checking 156 tarot card coverage (78 upright + 78 reversed)');

    // Get coverage stats
    const result = await client.execute({
      sql: `SELECT 
        card_name,
        is_reversed,
        COUNT(*) as sentence_count
      FROM tarot_custom_sentences 
      GROUP BY card_name, is_reversed
      ORDER BY card_name, is_reversed`,
      args: []
    });

    const coverage = new Map();
    for (const row of result.rows) {
      const cardName = row.card_name;
      const isReversed = row.is_reversed === 1;
      const count = row.sentence_count;
      
      if (!coverage.has(cardName)) {
        coverage.set(cardName, { upright: 0, reversed: 0 });
      }
      
      const cardData = coverage.get(cardName);
      if (isReversed) {
        cardData.reversed = count;
      } else {
        cardData.upright = count;
      }
    }

    // Calculate stats
    let fullyCovered = 0;
    let partiallyCovered = 0;
    let totalVariants = 0;

    for (const [cardName, data] of coverage.entries()) {
      const hasUpright = data.upright > 0;
      const hasReversed = data.reversed > 0;
      
      if (hasUpright && hasReversed) {
        fullyCovered++;
        totalVariants += 2;
      } else if (hasUpright || hasReversed) {
        partiallyCovered++;
        totalVariants += 1;
      }
    }

    const totalSentencesResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM tarot_custom_sentences',
      args: []
    });
    const totalSentences = totalSentencesResult.rows[0]?.count || 0;

    const expectedVariants = 156; // 78 cards × 2 orientations
    const completionPercentage = Math.round((totalVariants / expectedVariants) * 100);

    return NextResponse.json({
      success: true,
      validation: {
        totalExpectedVariants: expectedVariants,
        totalCoveredVariants: totalVariants,
        completionPercentage,
        isComplete: totalVariants === expectedVariants,
        totalSentences
      },
      coverage: {
        fullyCoveredCards: fullyCovered,
        partiallyCoveredCards: partiallyCovered,
        uniqueCards: coverage.size
      }
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}