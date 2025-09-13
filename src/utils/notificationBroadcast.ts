/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Store active connections - shared across the application
const connections = new Map<string, WritableStream>();

/**
 * Register a new SSE connection
 */
export function registerConnection(userId: string, connection: WritableStream) {
  connections.set(userId, connection);
}

/**
 * Remove an SSE connection
 */
export function removeConnection(userId: string) {
  connections.delete(userId);
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