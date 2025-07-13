/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { formatError } from '@/utils/errorHelpers';

// POST - Create tarot tables manually
export async function POST() {
  try {
    // Direct database connection following API_DATABASE_PROTOCOL.md
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
      return NextResponse.json({
        success: false,
        error: 'Database configuration not available'
      }, { status: 500 });
    }

    const { createClient } = await import('@libsql/client/http');
    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });

    // Check if tables already exist
    const progressResult = await client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="tarot_progress"');
    const sessionsResult = await client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="tarot_sessions"');
    const leaderboardResult = await client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="tarot_leaderboard"');

    let tablesCreated = [];
    
    // Create tarot_progress table
    if (progressResult.rows.length === 0) {
      await client.execute(`
        CREATE TABLE tarot_progress (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          card_id TEXT NOT NULL,
          familiarity_level TEXT NOT NULL DEFAULT 'novice',
          mastery_percentage INTEGER NOT NULL DEFAULT 0,
          total_attempts INTEGER NOT NULL DEFAULT 0,
          total_score INTEGER NOT NULL DEFAULT 0,
          average_score REAL NOT NULL DEFAULT 0,
          best_score INTEGER NOT NULL DEFAULT 0,
          learning_streak INTEGER NOT NULL DEFAULT 0,
          last_attempt_date TEXT,
          
          upright_attempts INTEGER NOT NULL DEFAULT 0,
          upright_score INTEGER NOT NULL DEFAULT 0,
          upright_average REAL NOT NULL DEFAULT 0,
          reversed_attempts INTEGER NOT NULL DEFAULT 0,
          reversed_score INTEGER NOT NULL DEFAULT 0,
          reversed_average REAL NOT NULL DEFAULT 0,
          
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          
          UNIQUE(user_id, card_id)
        )
      `);
      tablesCreated.push('tarot_progress');
    }

    // Create tarot_sessions table
    if (sessionsResult.rows.length === 0) {
      await client.execute(`
        CREATE TABLE tarot_sessions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          card_id TEXT NOT NULL,
          situation TEXT NOT NULL,
          user_interpretation TEXT NOT NULL,
          ai_feedback TEXT,
          score INTEGER NOT NULL DEFAULT 0,
          
          keyword_accuracy_score INTEGER NOT NULL DEFAULT 0,
          traditional_alignment_score INTEGER NOT NULL DEFAULT 0,
          context_relevance_score INTEGER NOT NULL DEFAULT 0,
          creativity_bonus INTEGER NOT NULL DEFAULT 0,
          
          session_duration INTEGER,
          card_orientation TEXT DEFAULT 'upright',
          difficulty_level TEXT DEFAULT 'beginner',
          
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
      `);
      tablesCreated.push('tarot_sessions');
    }

    // Create tarot_leaderboard table
    if (leaderboardResult.rows.length === 0) {
      await client.execute(`
        CREATE TABLE tarot_leaderboard (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          username TEXT NOT NULL,
          total_score INTEGER NOT NULL DEFAULT 0,
          total_cards_attempted INTEGER NOT NULL DEFAULT 0,
          cards_mastered INTEGER NOT NULL DEFAULT 0,
          accuracy_percentage REAL NOT NULL DEFAULT 0,
          learning_streak INTEGER NOT NULL DEFAULT 0,
          
          weekly_score INTEGER NOT NULL DEFAULT 0,
          monthly_score INTEGER NOT NULL DEFAULT 0,
          weekly_rank INTEGER,
          monthly_rank INTEGER,
          all_time_rank INTEGER,
          
          perfect_scores INTEGER NOT NULL DEFAULT 0,
          consecutive_days INTEGER NOT NULL DEFAULT 0,
          favorite_suit TEXT,
          
          last_activity_date TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          
          UNIQUE(user_id)
        )
      `);
      tablesCreated.push('tarot_leaderboard');
    }

    // Create indexes for performance
    if (tablesCreated.length > 0) {
      await client.execute('CREATE INDEX IF NOT EXISTS idx_tarot_progress_user_id ON tarot_progress(user_id)');
      await client.execute('CREATE INDEX IF NOT EXISTS idx_tarot_progress_card_id ON tarot_progress(card_id)');
      await client.execute('CREATE INDEX IF NOT EXISTS idx_tarot_sessions_user_id ON tarot_sessions(user_id)');
      await client.execute('CREATE INDEX IF NOT EXISTS idx_tarot_sessions_card_id ON tarot_sessions(card_id)');
      await client.execute('CREATE INDEX IF NOT EXISTS idx_tarot_leaderboard_total_score ON tarot_leaderboard(total_score DESC)');
      await client.execute('CREATE INDEX IF NOT EXISTS idx_tarot_leaderboard_accuracy ON tarot_leaderboard(accuracy_percentage DESC)');
    }

    return NextResponse.json({
      success: true,
      message: tablesCreated.length > 0 ? 
        `Successfully created tarot tables: ${tablesCreated.join(', ')}` :
        'All tarot tables already exist',
      tablesCreated,
      existingTables: {
        tarotProgress: progressResult.rows.length > 0,
        tarotSessions: sessionsResult.rows.length > 0,
        tarotLeaderboard: leaderboardResult.rows.length > 0
      }
    });
  } catch (error) {
    console.error('Error creating tarot tables:', error);
    const formattedError = formatError(error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create tarot tables: ' + formattedError.message
    }, { status: 500 });
  }
}

// GET - Check if tarot tables exist
export async function GET() {
  try {
    // Direct database connection following API_DATABASE_PROTOCOL.md
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
      return NextResponse.json({
        success: false,
        error: 'Database configuration not available'
      }, { status: 500 });
    }

    const { createClient } = await import('@libsql/client/http');
    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });

    const progressResult = await client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="tarot_progress"');
    const sessionsResult = await client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="tarot_sessions"');
    const leaderboardResult = await client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="tarot_leaderboard"');

    return NextResponse.json({
      success: true,
      tables: {
        tarotProgress: progressResult.rows.length > 0,
        tarotSessions: sessionsResult.rows.length > 0,
        tarotLeaderboard: leaderboardResult.rows.length > 0
      },
      allTablesExist: progressResult.rows.length > 0 && sessionsResult.rows.length > 0 && leaderboardResult.rows.length > 0
    });
  } catch (error) {
    console.error('Error checking tarot tables:', error);
    const formattedError = formatError(error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check tarot tables: ' + formattedError.message
    }, { status: 500 });
  }
}