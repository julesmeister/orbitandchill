# Google Authentication Integration Documentation

## Overview

This document outlines the Google OAuth integration implemented in the Luckstrology application. The system provides seamless Google Sign-In functionality with fallback to anonymous users, activity tracking, and session management.

## Current Implementation Status

### ✅ Completed Components

1. **Configuration Layer** (`src/config/auth.ts`)
   - Google OAuth client configuration
   - Feature flags and environment validation
   - Default user preferences setup
   - Session management configuration

2. **Authentication Hook** (`src/hooks/useGoogleAuth.ts`)
   - Google Sign-In flow with mock mode
   - Sign-out functionality with activity logging
   - Error handling and loading states
   - Anonymous user name generation

3. **User Interface** (`src/components/navbar/UserProfile.tsx`)
   - Dropdown menu with Google Sign-In option
   - Dynamic UI based on authentication state
   - Profile management integration

4. **API Endpoints** (`src/app/api/auth/logout/route.ts`)
   - Server-side logout handling
   - User activity timestamp updates
   - Session cleanup utilities

### ✅ Recently Completed

1. **Google OAuth Flow**
   - ✅ Google Identity Services script loaded in layout
   - ✅ Real Google API integration implemented
   - ✅ TypeScript definitions added for Google APIs
   - ✅ Error handling and validation

## Architecture Overview

### Authentication Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Profile  │ -> │  useGoogleAuth  │ -> │  Google OAuth   │
│   Component     │    │     Hook        │    │   Provider      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         |                       |                       |
         v                       v                       v
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Store    │ <- │  Activity Log   │ <- │  User Database  │
│   (Zustand)     │    │   (Analytics)   │    │    (Turso)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Models

```typescript
interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface User {
  id: string;                 // Google ID or anonymous ID
  username: string;           // Display name
  email?: string;             // Google email
  profilePictureUrl?: string; // Google avatar
  authProvider: "google" | "anonymous";
  createdAt: Date;
  updatedAt: Date;
  privacy: UserPrivacySettings;
  // ... additional fields
}
```

## Configuration

### Environment Variables

Required for production Google OAuth:

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Optional for development
NODE_ENV="development"  # Enables mock mode
```

### Google Cloud Console Setup

1. **Create OAuth Client ID**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID for Web Application

2. **Configure Redirect URIs**
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

3. **Set OAuth Consent Screen**
   - App name: "Orbit and Chill"
   - User support email
   - Developer contact information

## Implementation Details

### Mock Mode vs Production

The system includes a robust mock mode for development:

```typescript
// Development: Uses mock Google user
if (AUTH_CONFIG.features.mockMode) {
  googleUser = {
    id: 'google_' + Date.now(),
    email: 'user@gmail.com',
    name: 'Google User',
    picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
  };
}

// Production: TODO - Implement real Google OAuth
// Currently falls back to mock until OAuth is fully implemented
```

### User State Management

The authentication integrates with the existing Zustand store:

```typescript
// Update user store with Google data
await updateUser({
  id: googleUser.id,
  username: googleUser.name,
  email: googleUser.email,
  profilePictureUrl: googleUser.picture,
  authProvider: 'google',
  privacy: DEFAULT_USER_PREFERENCES.privacy,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### Activity Logging

All authentication events are logged:

```typescript
await UserActivityService.recordUserActivity(
  googleUser.id,
  'user_login',
  { authProvider: 'google' },
  {
    sessionId: `session_${Date.now()}`,
    ipAddress: await getUserIP()
  }
);
```

## Integration Steps to Complete

### 1. Install Google Identity Services

```bash
npm install @google-cloud/identity-platform
# OR use the official Google Identity Services script
```

### 2. Load Google Identity Services Script

Add to `app/layout.tsx`:

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 3. Replace Mock Implementation

Update `useGoogleAuth.ts` with real Google OAuth:

```typescript
// Replace the TODO section with:
const response = await new Promise<GoogleUser>((resolve, reject) => {
  if (!window.google) {
    reject(new Error('Google Identity Services not loaded'));
    return;
  }

  window.google.accounts.oauth2.initTokenClient({
    client_id: AUTH_CONFIG.google.clientId,
    scope: AUTH_CONFIG.google.scopes.join(' '),
    callback: async (tokenResponse) => {
      try {
        const userResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`
        );
        const userData = await userResponse.json();
        
        resolve({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          picture: userData.picture
        });
      } catch (error) {
        reject(error);
      }
    },
    error_callback: (error) => {
      reject(new Error(`Google OAuth error: ${error.type}`));
    }
  }).requestAccessToken();
});
```

### 4. Add Type Definitions

Create `types/google.d.ts`:

```typescript
interface Window {
  google: {
    accounts: {
      oauth2: {
        initTokenClient: (config: any) => {
          requestAccessToken: () => void;
        };
      };
    };
  };
}
```

## Security Considerations

### Privacy Settings

Default privacy settings are conservative:

```typescript
const DEFAULT_USER_PREFERENCES = {
  privacy: {
    showZodiacPublicly: true,
    showStelliumsPublicly: false,
    showBirthInfoPublicly: false,
    allowDirectMessages: true,
    showOnlineStatus: true,
  }
};
```

### Session Management

- Sessions are managed client-side via Zustand with persistence
- Server-side logout endpoint updates user activity
- Activity logging tracks authentication events

### Data Protection

- Google user data is only stored with explicit consent
- Anonymous users can continue using the app without Google auth
- Email addresses are optional and not required for core functionality

## Testing Strategy

### Development Testing

1. **Mock Mode Testing**
   - Set `NODE_ENV=development`
   - Test sign-in/sign-out flows
   - Verify user state management

2. **Component Testing**
   - Test UserProfile dropdown rendering
   - Verify authentication state displays
   - Test loading states and error handling

### Production Testing

1. **OAuth Flow Testing**
   - Test with real Google accounts
   - Verify redirect URIs work correctly
   - Test error scenarios (cancelled auth, network issues)

2. **Integration Testing**
   - Test database persistence
   - Verify activity logging
   - Test session management

## Troubleshooting

### Common Issues

1. **"Google OAuth is not configured properly"**
   - Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` environment variable
   - Verify `isGoogleOAuthReady()` function logic

2. **Google Sign-In button not showing**
   - Check user's `authProvider` state (only shows for anonymous users)
   - Verify component rendering logic in UserProfile

3. **Mock mode in production**
   - Ensure `NODE_ENV=production` is set
   - Check `AUTH_CONFIG.features.mockMode` logic

### Debug Mode

Enable debug logging:

```typescript
// Add to auth.ts
const DEBUG_AUTH = process.env.NODE_ENV === 'development';

if (DEBUG_AUTH) {
  console.log('Auth config:', AUTH_CONFIG);
  console.log('Google OAuth ready:', isGoogleOAuthReady());
}
```

## Future Enhancements

### Planned Features

1. **Multi-Provider Support**
   - Add Facebook, Apple, or Discord OAuth
   - Unified authentication interface

2. **Enhanced Session Management**
   - JWT tokens for server-side authentication
   - Refresh token handling
   - Session timeout warnings

3. **Advanced Privacy Controls**
   - Granular data sharing permissions
   - GDPR compliance features
   - Data export/deletion tools

### Performance Optimizations

1. **Lazy Loading**
   - Load Google Identity Services only when needed
   - Defer authentication UI until user interaction

2. **Caching**
   - Cache user preferences
   - Optimize database queries for user data

## Dependencies

### Current Dependencies

```json
{
  "zustand": "^5.0.5",           // State management
  "dexie": "^4.0.11",           // IndexedDB for persistence
  "drizzle-orm": "^0.44.2",     // Database ORM
  "@libsql/client": "^0.15.9"   // Turso database client
}
```

### Required for Full OAuth

```json
{
  "next-auth": "^4.24.0",          // Alternative: Full auth solution
  "@auth/drizzle-adapter": "^1.0.0" // Alternative: Auth.js adapter
}
```

## Conclusion

The Google Authentication system is well-architected with proper separation of concerns, error handling, and fallback mechanisms. The mock mode allows for development and testing without requiring Google OAuth setup, while the modular design makes it easy to swap in the real implementation when ready.

The system integrates seamlessly with the existing user management, providing a smooth transition from anonymous to authenticated users while maintaining data persistence and privacy controls.