/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from 'next/server';
import { NotificationService } from '@/db/services/notificationService';

/**
 * Server-Sent Events (SSE) endpoint for real-time notifications
 * GET /api/notifications/stream?userId=xxx
 */

// Store active connections
const connections = new Map<string, WritableStream>();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Create a readable stream for SSE
  let controller: ReadableStreamDefaultController | null = null;
  
  const stream = new ReadableStream({
    start(streamController) {
      controller = streamController;
      
      // Send initial connection message
      const data = JSON.stringify({
        type: 'connection',
        data: { message: 'Connected to notification stream', userId },
        timestamp: new Date().toISOString()
      });
      
      controller.enqueue(`data: ${data}\n\n`);
      
      // Send periodic heartbeat
      const heartbeat = setInterval(() => {
        if (controller) {
          const heartbeatData = JSON.stringify({
            type: 'heartbeat',
            data: { timestamp: new Date().toISOString() },
            timestamp: new Date().toISOString()
          });
          
          try {
            controller.enqueue(`data: ${heartbeatData}\n\n`);
          } catch (error) {
            clearInterval(heartbeat);
          }
        }
      }, 30000); // Heartbeat every 30 seconds

      // Store connection for broadcasting
      const writable = new WritableStream({
        write(chunk) {
          if (controller) {
            controller.enqueue(chunk);
          }
        },
        close() {
          clearInterval(heartbeat);
          connections.delete(userId);
        }
      });
      
      connections.set(userId, writable);

      // Check for new notifications periodically
      const notificationCheck = setInterval(async () => {
        try {
          // Get recent unread notifications
          const notifications = await NotificationService.getNotifications(userId, {
            isRead: false,
            limit: 5
          });

          // Send notifications if any found
          if (notifications.length > 0) {
            for (const notification of notifications) {
              const notificationData = JSON.stringify({
                type: 'notification',
                data: notification,
                timestamp: new Date().toISOString()
              });
              
              if (controller) {
                controller.enqueue(`data: ${notificationData}\n\n`);
              }
            }
          }
        } catch (error) {
          console.error('Error checking notifications:', error);
        }
      }, 5000); // Check every 5 seconds

      // Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        clearInterval(notificationCheck);
        connections.delete(userId);
        if (controller) {
          controller.close();
        }
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
}

/**
 * Broadcast notification to specific user
 */
export async function broadcastToUser(userId: string, notification: any) {
  const connection = connections.get(userId);
  if (connection) {
    const writer = connection.getWriter();
    try {
      const data = JSON.stringify({
        type: 'notification',
        data: notification,
        timestamp: new Date().toISOString()
      });
      
      await writer.write(`data: ${data}\n\n`);
      writer.releaseLock();
    } catch (error) {
      console.error('Error broadcasting to user:', error);
      // Remove failed connection
      connections.delete(userId);
    }
  }
}

/**
 * Broadcast to all connected users
 */
export async function broadcastToAll(notification: any) {
  const promises = Array.from(connections.entries()).map(([userId, connection]) => {
    return broadcastToUser(userId, notification);
  });
  
  await Promise.allSettled(promises);
}

/**
 * Get active connection count
 */
export function getActiveConnectionCount(): number {
  return connections.size;
}

/**
 * Get connected user IDs
 */
export function getConnectedUsers(): string[] {
  return Array.from(connections.keys());
}