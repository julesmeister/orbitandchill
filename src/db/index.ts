// Use Turso HTTP-only implementation to avoid native module issues
export * from './index-turso-http';

// Only auto-initialize on server-side (Node.js environment)
if (typeof window === 'undefined') {
  import('./index-turso-http').then(({ getDbAsync }) => {
    getDbAsync().catch(error => {
      console.error('❌ Database auto-initialization failed:', error);
    });
  });
}