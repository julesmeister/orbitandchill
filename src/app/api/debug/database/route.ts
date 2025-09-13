import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

// Initialize Turso client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const userId = searchParams.get('userId');
  const table = searchParams.get('table');
  const limit = searchParams.get('limit') || '10';

  try {
    let result: any = {};

    switch (action) {
      case 'user-check':
        if (!userId) {
          return NextResponse.json({ error: 'userId required for user-check' }, { status: 400 });
        }
        
        // Check if user exists in users table
        const userResult = await client.execute({
          sql: 'SELECT id, username, email, auth_provider FROM users WHERE id = ?',
          args: [userId]
        });
        
        result = {
          userExists: userResult.rows.length > 0,
          userData: userResult.rows[0] || null,
          totalUsers: await getUserCount(),
        };
        break;

      case 'table-info':
        if (!table) {
          return NextResponse.json({ error: 'table parameter required for table-info' }, { status: 400 });
        }
        
        // Get table schema information
        const schemaResult = await client.execute({
          sql: `PRAGMA table_info(${table})`,
          args: []
        });
        
        // Get row count
        const countResult = await client.execute({
          sql: `SELECT COUNT(*) as count FROM ${table}`,
          args: []
        });
        
        result = {
          tableName: table,
          columns: schemaResult.rows.map(row => ({
            name: row.name,
            type: row.type,
            notNull: row.notnull === 1,
            primaryKey: row.pk === 1,
            defaultValue: row.dflt_value
          })),
          rowCount: countResult.rows[0]?.count || 0
        };
        break;

      case 'table-sample':
        if (!table) {
          return NextResponse.json({ error: 'table parameter required for table-sample' }, { status: 400 });
        }
        
        // Get sample data from table
        const sampleResult = await client.execute({
          sql: `SELECT * FROM ${table} LIMIT ?`,
          args: [parseInt(limit)]
        });
        
        result = {
          tableName: table,
          sampleData: sampleResult.rows,
          columns: sampleResult.columns
        };
        break;

      case 'sentences-debug':
        if (!userId) {
          return NextResponse.json({ error: 'userId required for sentences-debug' }, { status: 400 });
        }
        
        // Check sentences table and related data
        const sentencesResult = await client.execute({
          sql: 'SELECT * FROM tarot_custom_sentences WHERE user_id = ? LIMIT ?',
          args: [userId, parseInt(limit)]
        });
        
        const sentencesCount = await client.execute({
          sql: 'SELECT COUNT(*) as count FROM tarot_custom_sentences WHERE user_id = ?',
          args: [userId]
        });
        
        result = {
          userId,
          userSentences: sentencesResult.rows,
          totalSentences: sentencesCount.rows[0]?.count || 0,
          userExists: await checkUserExists(userId),
          tableExists: await checkTableExists('tarot_custom_sentences')
        };
        break;

      case 'foreign-keys':
        // Check foreign key constraints
        const fkResult = await client.execute({
          sql: 'PRAGMA foreign_key_list(tarot_custom_sentences)',
          args: []
        });
        
        const fkEnabled = await client.execute({
          sql: 'PRAGMA foreign_keys',
          args: []
        });
        
        result = {
          foreignKeysEnabled: fkEnabled.rows[0]?.foreign_keys === 1,
          foreignKeyConstraints: fkResult.rows,
          tableConstraints: fkResult.rows.map(row => ({
            id: row.id,
            seq: row.seq,
            table: row.table,
            from: row.from,
            to: row.to,
            on_update: row.on_update,
            on_delete: row.on_delete,
            match: row.match
          }))
        };
        break;

      case 'all-tables':
        // List all tables in database
        const tablesResult = await client.execute({
          sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
          args: []
        });
        
        result = {
          tables: tablesResult.rows.map(row => row.name),
          totalTables: tablesResult.rows.length
        };
        break;

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Available: user-check, table-info, table-sample, sentences-debug, foreign-keys, all-tables' 
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      action,
      timestamp: new Date().toISOString(),
      result
    });

  } catch (error) {
    console.error('Database debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      action,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Helper functions
async function getUserCount(): Promise<number> {
  try {
    const result = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM users',
      args: []
    });
    return result.rows[0]?.count as number || 0;
  } catch {
    return 0;
  }
}

async function checkUserExists(userId: string): Promise<boolean> {
  try {
    const result = await client.execute({
      sql: 'SELECT 1 FROM users WHERE id = ? LIMIT 1',
      args: [userId]
    });
    return result.rows.length > 0;
  } catch {
    return false;
  }
}

async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const result = await client.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name = ?",
      args: [tableName]
    });
    return result.rows.length > 0;
  } catch {
    return false;
  }
}