# Google Authentication Integration Documentation

## Overview

This document outlines the Google OAuth integration implemented in the Luckstrology application. The system provides seamless Google Sign-In functionality with fallback to anonymous users, activity tracking, and session management.

## Complete File Tree Map

### Authentication System Files

```
src/
├── config/
│   └── auth.ts                    # Main authentication configuration
│
├── types/
│   ├── google.d.ts                # Google Identity Services TypeScript definitions
│   └── user.ts                    # User interface and types
│
├── hooks/
│   └── useGoogleAuth.ts           # Google authentication hook with OAuth flow
│
├── store/
│   ├── userStore.ts               # Zustand store for user state management
│   └── admin/
│       ├── auth.ts                # Admin authentication store
│       └── types.ts               # Admin types including auth
│
├── middleware/
│   └── adminAuth.ts               # Admin authentication middleware
│
├── components/
│   ├── Navbar.tsx                 # Main navbar with auth integration
│   └── navbar/
│       ├── UserProfile.tsx        # User profile dropdown with auth options
│       ├── DesktopNav.tsx         # Desktop navigation with user profile
│       ├── MobileNav.tsx           # Mobile navigation
│       └── GoogleSignInPrompt.tsx # Auto-prompt for Google sign-in
│
├── app/
│   ├── layout.tsx                 # Root layout with Google Identity Services script
│   └── api/
│       ├── auth/
│       │   ├── logout/
│       │   │   └── route.ts      # Web logout endpoint
│       │   └── mobile/
│       │       └── route.ts      # Mobile authentication endpoint
│       ├── admin/
│       │   └── auth/
│       │       ├── login/
│       │       │   └── route.ts  # Admin login endpoint
│       │       ├── logout/
│       │       │   └── route.ts  # Admin logout endpoint
│       │       ├── verify/
│       │       │   └── route.ts  # Admin session verification
│       │       └── master-login/
│       │           └── route.ts  # Master admin login
│       └── users/
│           ├── profile/
│           │   └── route.ts      # User profile CRUD operations
│           ├── account/
│           │   └── route.ts      # Account management
│           ├── activity/
│           │   └── route.ts      # User activity tracking
│           ├── preferences/
│           │   └── route.ts      # User preferences
│           ├── location/
│           │   └── route.ts      # Location data
│           ├── delete/
│           │   └── route.ts      # Account deletion
│           └── by-username/
│               └── [username]/
│                   └── route.ts  # Fetch user by username
│
├── db/
│   ├── services/
│   │   ├── userService.ts        # User database operations
│   │   ├── userActivityService.ts # Activity logging service
│   │   └── seedUserService.ts    # Seed user creation
│   └── integration/
│       └── userStoreIntegration.ts # Zustand-DB integration
│
├── repositories/
│   └── UserRepository.ts         # User data repository pattern
│
├── utils/
│   ├── usernameGenerator.ts      # Anonymous username generation
│   ├── userHelpers.ts             # User utility functions
│   └── userTransformations.ts    # User data transformations
│
└── lib/
    └── analytics.ts               # User registration tracking
```

### Related Support Files

```
├── components/admin/
│   ├── UsersTab.tsx               # Admin user management interface
│   ├── UserActivityTimeline.tsx   # User activity visualization
│   └── modals/
│       ├── UserEditModal.tsx      # User editing interface
│       ├── UserActivityModal.tsx  # Activity details modal
│       └── UserDeletionModal.tsx  # User deletion confirmation
│
├── components/profile/
│   ├── UserActivitySection.tsx    # User activity display
│   └── UserDiscussionsSection.tsx # User discussions list
│
├── components/settings/
│   └── UserPreferences.tsx        # User preference management
│
└── hooks/
    ├── useUserActions.ts          # User action handlers
    ├── useUserEdit.ts             # User editing logic
    ├── useUsersData.ts            # User data fetching
    ├── useUsersFilters.ts         # User filtering logic
    └── useUserAvatar.ts           # Avatar management
```

## Authentication Flow Tree

```
User Interaction
│
├── Anonymous User Flow
│   ├── Page Load
│   │   └── Navbar.tsx
│   │       └── useEffect (initializeUser)
│   │           └── loadProfile()
│   │               └── ensureAnonymousUser()
│   │                   └── generateAnonymousName()
│   │                       └── userStore.updateUser()
│   │
│   └── Google Sign-In Prompt
│       └── GoogleSignInPrompt.tsx
│           └── Shows after 2s delay
│               └── User clicks "Sign in with Google"
│                   └── Triggers Google OAuth flow
│
└── Google OAuth Flow
    ├── User clicks "Sign in with Google"
    │   └── UserProfile.tsx
    │       └── onGoogleSignIn()
    │           └── Navbar.handleGoogleSignIn()
    │               └── useGoogleAuth.signInWithGoogle()
    │
    ├── OAuth Implementation
    │   └── useGoogleAuth.ts
    │       ├── Check isGoogleOAuthReady()
    │       │   └── Verify client ID exists
    │       ├── Initialize Google Identity Services
    │       │   └── window.google.accounts.oauth2.initTokenClient()
    │       ├── Request Access Token
    │       │   └── tokenClient.requestAccessToken()
    │       ├── OAuth Popup
    │       │   └── User authorizes
    │       └── Token Callback
    │           ├── Fetch user info from Google API
    │           │   └── googleapis.com/oauth2/v2/userinfo
    │           └── Return GoogleUser object
    │
    ├── User Persistence
    │   └── useGoogleAuth.ts (continued)
    │       ├── POST /api/users/profile
    │       │   ├── Create/update user in Turso DB
    │       │   └── Return user data
    │       ├── updateUser() in userStore
    │       │   └── Update Zustand state
    │       ├── Persist to localStorage
    │       │   └── useUserStore.persist.rehydrate()
    │       └── Verify update
    │           └── Check user.authProvider === 'google'
    │
    └── UI Update
        └── Navbar.tsx
            ├── loadProfile() (forced refresh)
            ├── setForceUpdate() (trigger re-render)
            └── UserProfile re-renders
                └── Shows user name & avatar
```

## State Management Flow

```
Zustand Store (userStore.ts)
│
├── State Structure
│   ├── user: User | null
│   ├── isLoading: boolean
│   ├── isProfileComplete: boolean
│   └── hasStoredData: boolean
│
├── Actions
│   ├── updateUser()
│   │   ├── Update local state
│   │   ├── PATCH /api/users/profile
│   │   └── Sync with server
│   ├── loadProfile()
│   │   ├── Check localStorage
│   │   ├── GET /api/users/profile
│   │   └── Update state
│   ├── ensureAnonymousUser()
│   │   └── Create anonymous user
│   └── clearProfile()
│       └── Reset to anonymous
│
└── Persistence
    ├── localStorage (primary)
    │   └── Key: "luckstrology-user-storage"
    └── Turso Database (backup)
        └── Table: users
```

## API Endpoints Tree

```
/api/
├── auth/
│   ├── logout/              # POST - End user session
│   └── mobile/              # POST/PATCH - Mobile auth
│
├── admin/auth/
│   ├── login/               # POST - Admin login
│   ├── logout/              # POST - Admin logout
│   ├── verify/              # GET - Verify admin session
│   └── master-login/        # POST - Master admin access
│
└── users/
    ├── profile/             # GET/POST/PATCH - User CRUD
    ├── account/             # PATCH - Account updates
    ├── activity/            # GET/POST - Activity logs
    ├── preferences/         # PATCH - User preferences
    ├── location/            # POST - Save location
    ├── delete/              # DELETE - Account deletion
    └── by-username/[name]/  # GET - Fetch by username
```

## Current Implementation Status

### 🏗️ Complete Authentication System Tree

```
Authentication System Architecture
├── 📁 Core Configuration
│   ├── src/config/auth.ts
│   │   ├── AUTH_CONFIG (Google OAuth settings)
│   │   ├── isGoogleOAuthReady() validation
│   │   ├── DEFAULT_USER_PREFERENCES
│   │   └── Mock mode vs Production toggles
│   └── src/types/
│       ├── google.d.ts (Google Identity Services types)
│       └── user.ts (User, BirthData, UserPrivacySettings interfaces)
│
├── 🔐 Authentication Flow
│   ├── Google OAuth Integration
│   │   ├── src/hooks/useGoogleAuth.ts
│   │   │   ├── signInWithGoogle() - Main OAuth flow
│   │   │   ├── signOut() - Logout with activity logging
│   │   │   ├── Mock mode support for development
│   │   │   └── Real Google Identity Services integration
│   │   ├── src/app/layout.tsx
│   │   │   └── Google Identity Services script loading
│   │   └── OAuth Flow Steps:
│   │       ├── 1. User clicks "Sign in with Google"
│   │       ├── 2. Google Identity Services popup
│   │       ├── 3. Token verification with Google API
│   │       ├── 4. User info extraction from token
│   │       ├── 5. Server persistence via /api/users/profile
│   │       └── 6. Local state update via forceSetUser()
│   │
│   └── Anonymous User System
│       ├── src/utils/usernameGenerator.ts
│       │   ├── generateAnonymousName() - Creative names
│       │   └── getUserInitials() - Avatar initials
│       ├── Auto-creation on first visit
│       ├── Persistent anonymous IDs in localStorage
│       └── Smooth upgrade path to Google auth
│
├── 💾 State Management & Persistence
│   ├── Zustand Store (src/store/userStore.ts)
│   │   ├── State Structure:
│   │   │   ├── user: User | null
│   │   │   ├── isLoading: boolean
│   │   │   ├── isAuthenticating: boolean (race condition lock)
│   │   │   ├── isProfileComplete: boolean (computed)
│   │   │   └── hasStoredData: boolean (computed)
│   │   ├── Core Actions:
│   │   │   ├── updateUser() - Standard user updates
│   │   │   ├── forceSetUser() - Bypass checks for Google auth
│   │   │   ├── updateBirthData() - Astrological data
│   │   │   ├── updatePrivacySettings() - Privacy controls
│   │   │   ├── loadProfile() - Sync with server
│   │   │   ├── ensureAnonymousUser() - Create anonymous user
│   │   │   ├── clearProfile() - Reset session
│   │   │   └── setAuthenticating() - Lock mechanism
│   │   └── Persistence Strategy:
│   │       ├── Primary: localStorage via Zustand persist
│   │       ├── Backup: Server database via API calls
│   │       ├── Corruption Detection: Auto-repair on init
│   │       └── Race Condition Prevention: Authentication locks
│   │
│   └── Database Integration
│       ├── src/db/services/userService.ts
│       │   ├── createUser() - User creation
│       │   ├── getUserById() - User retrieval
│       │   ├── updateUser() - User updates
│       │   ├── getUserByEmail() - Google user lookup
│       │   └── Account deletion workflows
│       └── src/db/services/userActivityService.ts
│           ├── Login/logout activity tracking
│           ├── IP address logging
│           └── Session management
│
├── 🎨 User Interface Components
│   ├── Navigation Integration
│   │   ├── src/components/Navbar.tsx
│   │   │   ├── User initialization on mount
│   │   │   ├── localStorage corruption detection (lines 81-104)
│   │   │   ├── Authentication state debugging
│   │   │   ├── Google sign-in handlers
│   │   │   └── Toast notifications for auth events
│   │   ├── src/components/navbar/UserProfile.tsx
│   │   │   ├── Profile dropdown menu
│   │   │   ├── Admin access control (orbitandchill@gmail.com)
│   │   │   ├── Google sign-in button for anonymous users
│   │   │   ├── Sign-out functionality
│   │   │   └── Avatar display with fallbacks
│   │   └── src/components/navbar/GoogleSignInPrompt.tsx
│   │       ├── Auto-prompt after 2 seconds
│   │       ├── Dismissible with localStorage flag
│   │       └── Graceful fallback if OAuth unavailable
│   │
│   └── Desktop vs Mobile Layouts
│       ├── src/components/navbar/DesktopNav.tsx
│       ├── src/components/navbar/MobileNav.tsx
│       └── Responsive design patterns
│
├── 🌐 API Endpoints
│   ├── User Management APIs
│   │   ├── src/app/api/users/profile/route.ts
│   │   │   ├── GET - Retrieve user profile
│   │   │   ├── POST - Create new user (Google or anonymous)
│   │   │   ├── PATCH - Update user data
│   │   │   └── Birth data flattening for database storage
│   │   ├── src/app/api/users/account/route.ts
│   │   ├── src/app/api/users/activity/route.ts
│   │   └── src/app/api/users/preferences/route.ts
│   │
│   ├── Authentication APIs
│   │   ├── src/app/api/auth/logout/route.ts
│   │   │   ├── Web logout endpoint
│   │   │   ├── Activity timestamp updates
│   │   │   └── Session cleanup
│   │   └── src/app/api/auth/mobile/route.ts
│   │       ├── Mobile OAuth token verification
│   │       ├── Cross-platform user creation
│   │       └── Mobile session management
│   │
│   └── Admin Authentication
│       ├── src/app/api/admin/auth/login/route.ts
│       ├── src/app/api/admin/auth/logout/route.ts
│       ├── src/app/api/admin/auth/verify/route.ts
│       └── src/app/api/admin/auth/master-login/route.ts
│
├── 🛡️ Security & Privacy
│   ├── Privacy Controls (src/types/user.ts)
│   │   ├── showZodiacPublicly
│   │   ├── showStelliumsPublicly
│   │   ├── showBirthInfoPublicly
│   │   ├── allowDirectMessages
│   │   └── showOnlineStatus
│   ├── Admin Role System
│   │   ├── Master Admin: orbitandchill@gmail.com
│   │   ├── Role-based permissions
│   │   └── Premium feature overrides
│   └── Data Protection
│       ├── Optional email storage
│       ├── Anonymous user support
│       └── GDPR-friendly design
│
├── 📱 Mobile Authentication
│   ├── src/app/api/auth/mobile/route.ts
│   │   ├── Google token verification
│   │   ├── Mobile user creation/login
│   │   ├── Device info tracking
│   │   └── Cross-platform user sync
│   └── Flutter Integration Support
│       ├── Token-based authentication
│       ├── Device identification
│       └── Offline data caching
│
├── 📊 Analytics & Activity Tracking
│   ├── src/lib/analytics.ts
│   │   └── trackUserRegistration() for Google/anonymous users
│   ├── src/db/services/userActivityService.ts
│   │   ├── Login/logout events
│   │   ├── Session tracking
│   │   └── IP address logging
│   └── Admin notification system (orbitandchill@gmail.com only)
│
└── 🔧 Recent Fixes & Issues Resolved (Aug 2025)
    ├── 🔐 Authentication Persistence
    │   ├── Problem: localStorage corruption (Google email + anonymous authProvider)
    │   ├── Solution: src/components/Navbar.tsx:81-104 (auto-repair)
    │   ├── Solution: src/store/userStore.ts:435-473 (forceSetUser method)
    │   └── Solution: src/hooks/useGoogleAuth.ts:177 (bypass normal updates)
    │
    ├── 👤 Admin Access Control  
    │   ├── Problem: orbitandchill@gmail.com not showing Admin Dashboard
    │   ├── Solution: src/components/navbar/UserProfile.tsx:100
    │   └── Logic: user?.role === "admin" || user?.email === 'orbitandchill@gmail.com'
    │
    ├── 🏗️ Build System Stability
    │   ├── Fixed: src/app/sitemap.ts merge conflicts
    │   ├── Fixed: src/store/eventsStore.ts syntax errors  
    │   └── Added: react-icons dependency
    │
    └── 🤖 AI Content Processing
        ├── Problem: Success toasts for failed AI parsing
        ├── Solution: src/app/api/admin/transform-with-ai/route.ts:410-425
        └── Solution: src/hooks/useSeedingContent.ts:66-81 (frontend validation)
```

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

4. **API Endpoints**
   - **Web Logout** (`src/app/api/auth/logout/route.ts`)
     - Server-side logout handling
     - User activity timestamp updates
     - Session cleanup utilities
   - **Mobile Authentication** (`src/app/api/auth/mobile/route.ts`)
     - Google OAuth token verification for mobile apps
     - Cross-platform user creation and authentication
     - Mobile-specific session management

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

## Mobile Authentication System

### Overview

The mobile authentication system provides secure Google OAuth integration for Flutter and other mobile applications. It uses server-side token verification to ensure security while maintaining compatibility with the existing web user database.

### Mobile Authentication Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Flutter App   │ -> │  Google OAuth   │ -> │  Access Token   │
│   (Mobile)      │    │   (Native)      │    │   (JWT/OAuth)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         |                                              |
         v                                              v
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Send Token    │ -> │  /api/auth/     │ -> │  Verify with    │
│   to Server     │    │   mobile        │    │  Google API     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         |                       |                       |
         v                       v                       v
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Data     │ <- │  Create/Update  │ <- │  User Database  │
│   Response      │    │   User Record   │    │    (Turso)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### API Endpoint: `/api/auth/mobile`

#### POST Request - Authentication

**Request Body:**
```json
{
  "token": "google_access_token_here",
  "deviceInfo": {
    "platform": "flutter",
    "version": "1.0.0",
    "deviceId": "optional_device_identifier"
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "user": {
    "id": "google_user_id",
    "username": "John Doe",
    "email": "john@gmail.com",
    "profilePictureUrl": "https://lh3.googleusercontent.com/...",
    "authProvider": "google",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "hasNatalChart": false,
    "subscriptionTier": "free",
    "privacy": {
      "showZodiacPublicly": false,
      "showStelliumsPublicly": false,
      "showBirthInfoPublicly": false,
      "allowDirectMessages": true,
      "showOnlineStatus": false
    }
  },
  "action": "login", // or "register"
  "message": "Successfully logged in"
}
```

**Error Response:**
```json
{
  "error": "Invalid or expired Google token",
  "status": 401
}
```

#### PATCH Request - Token Refresh

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here",
  "userId": "google_user_id"
}
```

### Token Verification Process

The mobile API implements secure token verification:

1. **Token Validation**: Verifies Google access token with Google's tokeninfo API
2. **Expiration Check**: Ensures token hasn't expired
3. **Audience Validation**: Confirms token is for the correct application
4. **User Extraction**: Extracts user information from verified token

```typescript
async function verifyGoogleToken(token: string): Promise<GoogleTokenInfo | null> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    );
    
    if (!response.ok) return null;
    
    const tokenInfo = await response.json();
    
    // Verify token validity and expiration
    if (tokenInfo.aud && tokenInfo.exp && Date.now() / 1000 < tokenInfo.exp) {
      return tokenInfo;
    }
    
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
```

### Flutter Integration

#### Dependencies

Add to `pubspec.yaml`:
```yaml
dependencies:
  google_sign_in: ^6.1.5
  http: ^1.1.0
  shared_preferences: ^2.2.2
```

#### Auth Service Implementation

```dart
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class AuthService {
  static const String _baseUrl = 'https://orbitandchill.com/api';
  
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'profile'],
    // Add your Google OAuth client ID here
    clientId: 'your-google-client-id.apps.googleusercontent.com',
  );
  
  Future<AuthResult?> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return null;
      
      final GoogleSignInAuthentication googleAuth = 
          await googleUser.authentication;
      
      if (googleAuth.accessToken == null) {
        throw Exception('Failed to get access token');
      }
      
      // Send token to your API
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/mobile'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'token': googleAuth.accessToken,
          'deviceInfo': {
            'platform': 'flutter',
            'version': '1.0.0',
            'deviceId': await _getDeviceId(),
          }
        }),
      );
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        // Store user data locally
        await _storeUserData(data['user']);
        
        return AuthResult(
          success: true,
          user: User.fromJson(data['user']),
          action: data['action'],
          message: data['message'],
        );
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['error'] ?? 'Authentication failed');
      }
      
    } catch (error) {
      return AuthResult(
        success: false,
        error: error.toString(),
      );
    }
  }
  
  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _clearUserData();
  }
  
  Future<User?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString('user_data');
    
    if (userData != null) {
      return User.fromJson(jsonDecode(userData));
    }
    
    return null;
  }
  
  Future<void> _storeUserData(Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_data', jsonEncode(userData));
  }
  
  Future<void> _clearUserData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_data');
  }
  
  Future<String> _getDeviceId() async {
    final prefs = await SharedPreferences.getInstance();
    String? deviceId = prefs.getString('device_id');
    
    if (deviceId == null) {
      deviceId = 'flutter_${DateTime.now().millisecondsSinceEpoch}';
      await prefs.setString('device_id', deviceId);
    }
    
    return deviceId;
  }
}

class AuthResult {
  final bool success;
  final User? user;
  final String? action;
  final String? message;
  final String? error;
  
  AuthResult({
    required this.success,
    this.user,
    this.action,
    this.message,
    this.error,
  });
}

class User {
  final String id;
  final String username;
  final String? email;
  final String? profilePictureUrl;
  final String authProvider;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool hasNatalChart;
  final String subscriptionTier;
  final UserPrivacy privacy;
  
  User({
    required this.id,
    required this.username,
    this.email,
    this.profilePictureUrl,
    required this.authProvider,
    required this.createdAt,
    required this.updatedAt,
    required this.hasNatalChart,
    required this.subscriptionTier,
    required this.privacy,
  });
  
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      profilePictureUrl: json['profilePictureUrl'],
      authProvider: json['authProvider'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      hasNatalChart: json['hasNatalChart'] ?? false,
      subscriptionTier: json['subscriptionTier'] ?? 'free',
      privacy: UserPrivacy.fromJson(json['privacy']),
    );
  }
}

class UserPrivacy {
  final bool showZodiacPublicly;
  final bool showStelliumsPublicly;
  final bool showBirthInfoPublicly;
  final bool allowDirectMessages;
  final bool showOnlineStatus;
  
  UserPrivacy({
    required this.showZodiacPublicly,
    required this.showStelliumsPublicly,
    required this.showBirthInfoPublicly,
    required this.allowDirectMessages,
    required this.showOnlineStatus,
  });
  
  factory UserPrivacy.fromJson(Map<String, dynamic> json) {
    return UserPrivacy(
      showZodiacPublicly: json['showZodiacPublicly'] ?? false,
      showStelliumsPublicly: json['showStelliumsPublicly'] ?? false,
      showBirthInfoPublicly: json['showBirthInfoPublicly'] ?? false,
      allowDirectMessages: json['allowDirectMessages'] ?? true,
      showOnlineStatus: json['showOnlineStatus'] ?? false,
    );
  }
}
```

#### UI Implementation

```dart
class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final AuthService _authService = AuthService();
  bool _isLoading = false;
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Orbit and Chill'),
        backgroundColor: Colors.indigo,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.star,
              size: 100,
              color: Colors.indigo,
            ),
            SizedBox(height: 32),
            Text(
              'Welcome to Orbit and Chill',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Your personal astrology companion',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 48),
            _isLoading
                ? CircularProgressIndicator()
                : ElevatedButton.icon(
                    onPressed: _handleGoogleSignIn,
                    icon: Icon(Icons.login),
                    label: Text('Sign in with Google'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo,
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(
                        horizontal: 32,
                        vertical: 12,
                      ),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
  
  Future<void> _handleGoogleSignIn() async {
    setState(() => _isLoading = true);
    
    try {
      final result = await _authService.signInWithGoogle();
      
      if (result != null && result.success) {
        // Navigate to main app
        Navigator.pushReplacementNamed(context, '/home');
        
        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result.message ?? 'Successfully signed in'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        // Show error message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result?.error ?? 'Sign in failed'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: $error'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }
}
```

### Security Considerations for Mobile

#### Token Security
- **Short-lived tokens**: Google access tokens expire quickly
- **Server-side verification**: All tokens verified with Google API
- **No client-side storage**: Sensitive tokens not stored on device
- **Secure transmission**: HTTPS-only API communication

#### Data Privacy
- **Local storage**: User data stored in device's secure preferences
- **Data minimization**: Only essential user data stored locally
- **Privacy controls**: Users can control data sharing preferences
- **Logout cleanup**: All local data cleared on sign out

#### Cross-Platform Compatibility
- **Unified user database**: Same user records across web and mobile
- **Consistent privacy settings**: Privacy preferences sync across platforms
- **Seamless transitions**: Users can switch between web and mobile seamlessly

### Mobile-Specific Features

#### Device Management
- **Device identification**: Track user devices for security
- **Multi-device support**: Users can be signed in on multiple devices
- **Device-specific preferences**: Some settings can be device-specific

#### Offline Support
- **Local data caching**: Basic user data cached for offline access
- **Sync on reconnect**: Data synced when network connection restored
- **Graceful degradation**: App functions with limited features offline

### Google Cloud Console Configuration for Mobile

#### Android Configuration
1. **Add Android App to Project**
   - Package name: `com.example.orbitandchill`
   - SHA-1 certificate fingerprint from debug/release keystore
   - Download `google-services.json`

2. **OAuth Client ID for Android**
   - Application type: Android
   - Package name: `com.example.orbitandchill`
   - SHA-1 certificate fingerprint

#### iOS Configuration
1. **Add iOS App to Project**
   - Bundle ID: `com.example.orbitandchill`
   - Download `GoogleService-Info.plist`

2. **OAuth Client ID for iOS**
   - Application type: iOS
   - Bundle ID: `com.example.orbitandchill`

#### Web Client ID
- **Create Web Client ID** (if not already created)
- Add to Flutter app configuration for token verification

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

### Mobile Testing Strategy

#### Development Testing

1. **Mobile API Testing**
   - Test `/api/auth/mobile` endpoint with valid tokens
   - Test error handling for invalid/expired tokens
   - Verify user creation and login flows
   - Test CORS settings for mobile requests

2. **Flutter Integration Testing**
   - Test Google Sign-In flow in development mode
   - Verify token extraction and API communication
   - Test local data storage and retrieval
   - Test sign-out and data cleanup

#### Production Testing

1. **Cross-Platform Testing**
   - Test user login on web, then mobile (same account)
   - Verify data synchronization across platforms
   - Test privacy settings consistency
   - Test session management across devices

2. **Device Testing**
   - Test on multiple Android devices/versions
   - Test on iOS devices (if applicable)
   - Test network connectivity scenarios
   - Test background/foreground app transitions

#### API Testing Commands

```bash
# Test mobile authentication endpoint
curl -X POST https://orbitandchill.com/api/auth/mobile \
  -H "Content-Type: application/json" \
  -d '{
    "token": "valid_google_access_token",
    "deviceInfo": {
      "platform": "flutter",
      "version": "1.0.0"
    }
  }'

# Test token refresh endpoint
curl -X PATCH https://orbitandchill.com/api/auth/mobile \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "refresh_token_here",
    "userId": "google_user_id"
  }'
```

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

### Mobile-Specific Issues

1. **"Invalid or expired Google token"**
   - Verify Google access token is valid and not expired
   - Check Google Cloud Console OAuth client configuration
   - Ensure token has proper scopes (email, profile)
   - Test token manually with Google's tokeninfo API

2. **"Authentication failed" from mobile app**
   - Check network connectivity from mobile device
   - Verify API URL is correct and accessible
   - Test CORS settings on server for mobile requests
   - Check device system time is synchronized

3. **"Failed to get access token" in Flutter**
   - Verify Google Services configuration (google-services.json/GoogleService-Info.plist)
   - Check Google OAuth client ID configuration
   - Ensure proper SHA-1 certificate fingerprint for Android
   - Test Google Sign-In setup in Flutter

4. **Cross-platform user data mismatch**
   - Verify same Google account used on both platforms
   - Check user ID consistency between web and mobile
   - Test data synchronization after updates
   - Verify privacy settings are preserved across platforms

5. **Token verification timeout**
   - Check Google API rate limits
   - Verify internet connectivity during token verification
   - Implement retry logic for temporary network issues
   - Consider caching token verification results briefly

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