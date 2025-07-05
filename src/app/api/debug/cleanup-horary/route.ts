/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { executePooledQuery } from '@/db/connectionPool';

/**
 * Debug cleanup endpoint to remove test horary questions
 * DELETE /api/debug/cleanup-horary
 */
export async function DELETE(request: NextRequest) {
  try {

    // Define patterns for debug questions to remove
    const debugPatterns = [
      'horary_debug_%',           // Questions with horary_debug_ prefix
      '%Debug test question%',    // Questions containing "Debug test question"
      '%database integration test%', // Specific test pattern
    ];

    const debugUserPatterns = [
      'debug_user_%',             // Users with debug_user_ prefix
    ];

    let deletedCount = 0;
    const errors: string[] = [];

    // Try connection pool first
    try {
      
      // Delete questions by ID pattern
      for (const pattern of debugPatterns) {
        const deleteByQuestionSql = `
          DELETE FROM horary_questions 
          WHERE id LIKE ? OR question LIKE ?
        `;
        
        const result = await executePooledQuery(deleteByQuestionSql, [pattern, pattern]);
        const rowsAffected = result.rowsAffected || 0;
        deletedCount += rowsAffected;
        
        if (rowsAffected > 0) {
        }
      }

      // Delete questions by debug user pattern
      for (const userPattern of debugUserPatterns) {
        const deleteByUserSql = `
          DELETE FROM horary_questions 
          WHERE user_id LIKE ? OR user_id IS NULL
        `;
        
        const result = await executePooledQuery(deleteByUserSql, [userPattern]);
        const rowsAffected = result.rowsAffected || 0;
        deletedCount += rowsAffected;
        
        if (rowsAffected > 0) {
        }
      }

    } catch (poolError) {
      console.warn('⚠️ Connection pool failed, falling back to direct connection...', poolError);
      
      // Fallback to direct database connection
      try {
        const databaseUrl = process.env.TURSO_DATABASE_URL;
        const authToken = process.env.TURSO_AUTH_TOKEN;
        
        if (databaseUrl && authToken) {
          const { createClient } = await import('@libsql/client/http');
          const client = createClient({
            url: databaseUrl,
            authToken: authToken,
          });
          
          // Build a comprehensive cleanup query
          const cleanupSql = `
            DELETE FROM horary_questions 
            WHERE 
              id LIKE 'horary_debug_%' OR
              question LIKE '%Debug test question%' OR
              question LIKE '%database integration test%' OR
              user_id LIKE 'debug_user_%' OR
              user_id IS NULL
          `;
          
          const result = await client.execute(cleanupSql);
          deletedCount = result.rowsAffected || 0;
          
        } else {
          errors.push('Database environment variables not available');
        }
        
      } catch (directError) {
        console.error('❌ Direct connection cleanup failed:', directError);
        errors.push(`Direct connection error: ${directError instanceof Error ? directError.message : String(directError)}`);
      }
    }

    // Get remaining questions count for verification
    let remainingCount = 0;
    try {
      const countSql = `
        SELECT COUNT(*) as count FROM horary_questions 
        WHERE 
          id LIKE 'horary_debug_%' OR
          question LIKE '%Debug test question%' OR
          user_id LIKE 'debug_user_%'
      `;
      
      const countResult = await executePooledQuery(countSql, []);
      remainingCount = countResult.rows?.[0]?.count || 0;
    } catch (countError) {
      console.warn('⚠️ Could not verify remaining debug questions:', countError);
    }

    return NextResponse.json({
      success: true,
      message: 'Debug horary questions cleanup completed',
      results: {
        deletedCount,
        remainingDebugQuestions: remainingCount,
        patternsProcessed: debugPatterns.concat(debugUserPatterns),
        errors: errors.length > 0 ? errors : null,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Debug cleanup failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Debug cleanup failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}