/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';

interface HealthMetrics {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  uptimePercentage: string;
  lastChecked: string;
  database: {
    status: 'connected' | 'disconnected' | 'error';
    responseTime?: number;
  };
  api: {
    status: 'operational' | 'slow' | 'error';
    responseTime?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

// Store uptime start time (in production, this would be persistent)
const startTime = Date.now();

// Simple in-memory store for uptime tracking (in production, use Redis/database)
let healthHistory: { timestamp: number; status: 'up' | 'down' }[] = [];
const maxHistoryEntries = 288; // 24 hours of 5-minute intervals (reduced memory usage)

export async function GET() {
  try {
    const startCheck = Date.now();
    
    // Test database connection
    let dbStatus: 'connected' | 'disconnected' | 'error' = 'disconnected';
    let dbResponseTime: number | undefined;
    
    try {
      const dbStart = Date.now();
      const { db } = await initializeDatabase();
      
      if (db) {
        // Test a simple query
        const dbObj = db as any;
        if (dbObj.client) {
          await dbObj.client.execute('SELECT 1 as test');
          dbStatus = 'connected';
          dbResponseTime = Date.now() - dbStart;
        }
      }
    } catch (error) {
      console.error('Database health check failed:', error);
      dbStatus = 'error';
    }
    
    // Calculate uptime
    const currentTime = Date.now();
    const uptimeMs = currentTime - startTime;
    const uptimeHours = uptimeMs / (1000 * 60 * 60);
    
    // Record current status in history (only every 5 minutes to reduce memory)
    const currentStatus = dbStatus === 'connected' ? 'up' : 'down';
    const lastEntry = healthHistory[healthHistory.length - 1];
    const shouldRecord = !lastEntry || (currentTime - lastEntry.timestamp) >= 300000; // 5 minutes
    
    if (shouldRecord) {
      healthHistory.push({
        timestamp: currentTime,
        status: currentStatus
      });
      
      // Keep only last 288 entries (24 hours of 5-minute intervals) and limit array size
      if (healthHistory.length > maxHistoryEntries) {
        healthHistory = healthHistory.slice(-maxHistoryEntries);
      }
    }
    
    // Calculate uptime percentage from history (last 24 hours)
    const upEntries = healthHistory.filter(entry => entry.status === 'up').length;
    const totalEntries = healthHistory.length;
    const uptimePercentage = totalEntries > 0 
      ? ((upEntries / totalEntries) * 100).toFixed(1)
      : '100.0';
    
    // Get memory usage (simplified for Node.js)
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = ((usedMemory / totalMemory) * 100);
    
    // API response time
    const apiResponseTime = Date.now() - startCheck;
    
    // Determine overall status
    let overallStatus: 'healthy' | 'degraded' | 'down' = 'healthy';
    if (dbStatus === 'error' || apiResponseTime > 5000) {
      overallStatus = 'down';
    } else if (dbStatus === 'disconnected' || apiResponseTime > 1000 || memoryPercentage > 80) {
      overallStatus = 'degraded';
    }
    
    const healthMetrics: HealthMetrics = {
      status: overallStatus,
      uptime: Math.floor(uptimeHours * 100) / 100, // Round to 2 decimal places
      uptimePercentage,
      lastChecked: new Date().toISOString(),
      database: {
        status: dbStatus,
        responseTime: dbResponseTime
      },
      api: {
        status: apiResponseTime > 1000 ? 'slow' : 'operational',
        responseTime: apiResponseTime
      },
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: Math.round(memoryPercentage * 100) / 100
      }
    };
    
    return NextResponse.json({
      success: true,
      health: healthMetrics
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      success: false,
      health: {
        status: 'down',
        uptime: 0,
        uptimePercentage: '0.0',
        lastChecked: new Date().toISOString(),
        database: { status: 'error' },
        api: { status: 'error' },
        memory: { used: 0, total: 0, percentage: 0 }
      } as HealthMetrics,
      error: 'Health check system failure'
    }, {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}