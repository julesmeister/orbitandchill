# Discussions Seeding Plan - File Index

This document indexes all files involved in the AI-powered discussion seeding system implementation.

## 📋 Plan Documentation
- **DISCUSSIONS_SEEDING_PLAN.md** - Master plan document with user personas, workflows, and requirements

## 🧑‍🤝‍🧑 User Personas & Data
- **src/data/seedPersonas.ts** - Complete persona templates (20 users) with astrological profiles
- **src/hooks/useSeedUsers.ts** - React hook for managing seed user state and operations

## 🗄️ Database Layer

### Schema & Migrations
- **src/db/schema.ts** - Database schema definitions including seeding tables
- **src/app/api/admin/migrate-seeding-tables/route.ts** - Migration API for creating seeding tables

### Database Services
- **src/db/services/seedUserService.ts** - Core database operations for seed users and batches
- **src/db/index-turso-http.ts** - Database connection and configuration
- **src/store/database.ts** - Database utilities and helpers

### Legacy Seed Data (Pre-AI System)
- **src/db/seed-discussions.ts** - Static discussion seed data (legacy)
- **src/db/seed-categories-tags.ts** - Category and tag seed data
- **src/db/mock-db.ts** - Mock database for development
- **src/app/api/admin/seed-data/route.ts** - Legacy seed data API

## 🤖 AI Content Processing

### Core AI APIs
- **src/app/api/admin/transform-with-ai/route.ts** - Main AI transformation endpoint
- **src/app/api/admin/generate-reply/route.ts** - AI reply generation endpoint
- **src/app/api/admin/process-pasted-content/route.ts** - Content parsing and preprocessing
- **src/app/api/admin/process-comments/route.ts** - **NEW: AI comment processing and rephrasing**
- **src/app/api/admin/ai-config/route.ts** - **NEW: AI configuration persistence and retrieval**

### AI Utility Functions
- **src/utils/commentProcessing.ts** - **NEW: Comment extraction, AI rephrasing, and robust JSON parsing**

### Custom Hooks for AI Operations
- **src/hooks/useAiConfiguration.ts** - AI provider and model configuration
- **src/hooks/usePublicAIConfig.ts** - **NEW: Centralized AI configuration for public access**
- **src/hooks/useAIConfigAdmin.ts** - **NEW: Admin-specific AI configuration management**
- **src/hooks/useContentProcessing.ts** - Content parsing and transformation logic (legacy)
- **src/hooks/useReplyGeneration.ts** - AI reply generation management
- **src/hooks/useGenerationSettings.ts** - Reply and voting generation settings
- **src/hooks/useSeedingPersistence.ts** - **STATE PERSISTENCE & RECOVERY** with localStorage
- **src/hooks/useSeedingOperations.ts** - Core seeding operations and AI processing
- **src/hooks/useReplyManagement.ts** - **NEW: Reply generation with toast notifications**
- **src/hooks/useToastNotifications.ts** - **NEW: Centralized toast notification system**

## 🔄 Seeding Execution & Progress

### Execution APIs
- **src/app/api/admin/execute-seeding/route.ts** - Main seeding execution endpoint
- **src/app/api/admin/seeding-progress/[batchId]/route.ts** - Batch progress tracking
- **src/app/api/admin/clear-seeded-content/route.ts** - Cleanup and rollback operations

### Execution Hooks
- **src/hooks/useSeedingExecution.ts** - Seeding process orchestration and monitoring

## 👥 User Management APIs

### Seed User CRUD
- **src/app/api/admin/seed-users/route.ts** - Seed user CRUD operations
- **src/app/api/admin/seed-users/bulk-create/route.ts** - Bulk seed user creation

### General User Management
- **src/app/api/admin/users/route.ts** - User management API
- **src/app/api/admin/users/[id]/route.ts** - Individual user operations
- **src/app/api/admin/users/[id]/update/route.ts** - User update operations
- **src/app/api/admin/users/search/route.ts** - User search functionality

## 🎨 Admin UI Components

### Main Admin Interface
- **src/components/admin/AdminDashboard.tsx** - Main admin dashboard
- **src/components/admin/AdminHeader.tsx** - Admin navigation header
- **src/components/admin/SeedingTab.tsx** - **PRIMARY SEEDING INTERFACE** with all UI components

### Seeding UI Components
- **src/components/admin/seeding/AIConfigurationForm.tsx** - **ENHANCED: AI model and API configuration with database persistence**
- **src/components/admin/seeding/ContentInputForm.tsx** - Content input with comment processing
- **src/components/admin/seeding/PreviewContentDisplay.tsx** - **ENHANCED: Inline editing, clear replies, seamless UX**
- **src/components/admin/seeding/GenerationSettings.tsx** - Reply generation controls
- **src/components/admin/seeding/UserPersonaManager.tsx** - Persona selection interface
- **src/components/admin/seeding/ProcessSteps.tsx** - Visual process workflow
- **src/components/admin/seeding/SeedingActionButtons.tsx** - Main action controls
- **src/components/admin/seeding/PersonaSelector.tsx** - Active persona management

### Supporting Admin Components
- **src/components/admin/AuditLogsTab.tsx** - Audit logging interface
- **src/hooks/useAdminSettings.ts** - Admin settings management

## 📊 Analytics & Monitoring

### Seeding Analytics
- **src/app/api/admin/seed-analytics/route.ts** - Seeding performance metrics

### General Analytics
- **src/app/api/admin/metrics/route.ts** - System metrics
- **src/app/api/admin/real-user-analytics/route.ts** - User behavior analytics
- **src/app/api/admin/user-analytics/route.ts** - User-specific analytics
- **src/app/api/admin/enhanced-metrics/route.ts** - Enhanced analytics
- **src/hooks/useRealMetrics.ts** - Real-time metrics hook

## 🔧 Core Types & Interfaces

### Discussion & Forum Types
- **src/types/threads.ts** - Discussion, reply, and forum-related types
- **src/types/user.ts** - User profile and authentication types
- **src/types/categories.ts** - Category and tag definitions

### Supporting Types
- **src/types/charts.ts** - Astrological chart types
- **src/types/index.ts** - General type definitions
- **src/types/adminSettings.ts** - Admin configuration types

## 🔗 Discussion & Forum Integration

### Discussion Management
- **src/hooks/useDiscussions.ts** - Discussion data management
- **src/hooks/useDiscussionMeta.ts** - Discussion metadata and SEO
- **src/hooks/useDiscussionForm.ts** - Discussion creation forms
- **src/hooks/useReplyHandling.ts** - Reply threading and management
- **src/hooks/useVoting.ts** - Voting system integration

### Categories & Organization
- **src/hooks/useCategories.ts** - Category management

## 🛠️ Utility Functions

### Content Generation Helpers
- **src/utils/usernameGenerator.ts** - Utility for generating usernames

### Authentication & Security
- **src/hooks/useGoogleAuth.ts** - Google OAuth integration
- **src/app/api/admin/auth/verify/route.ts** - Admin authentication verification
- **src/app/api/admin/auth/login/route.ts** - Admin login
- **src/app/api/admin/auth/logout/route.ts** - Admin logout
- **src/app/api/admin/auth/master-login/route.ts** - Master admin login

## 📋 Audit & Logging

### Audit Services
- **src/db/services/auditService.ts** - General audit logging
- **src/db/services/adminAuditService.ts** - Admin-specific audit logging
- **src/app/api/admin/audit-logs/route.ts** - Audit log API
- **src/app/api/admin/audit-logs/stats/route.ts** - Audit statistics

## 🎯 Implementation Status

### ✅ Completed (Phase 1-7)
- Core infrastructure (database tables, APIs)
- AI integration pipeline with DeepSeek R1 Distill Llama 70B
- Database operations and user management
- Complete persona system with 20 detailed users
- Admin UI with content preview and mood selection
- **Advanced State Persistence**: Auto-recovery from localStorage and seedingResults
- **Data Recovery System**: Automatic restoration of AI-transformed content on refresh
- **Field Migration**: Backward compatibility for evolving data structures
- **Comment Processing System**: AI-powered comment extraction and rephrasing (Phase 6)
- **Enhanced JSON Parsing**: Robust parsing with multiple fallback strategies (Phase 6)
- **Seamless Inline Editing**: Click-to-edit functionality without textarea appearance (Phase 6)
- **Advanced Toast System**: Comprehensive user feedback for all operations (Phase 6)
- **Auto-scroll UX**: Automatic navigation to relevant content sections (Phase 6)
- **Centralized AI Configuration**: Database-persisted AI config for public access (Phase 7)
- **Fallback Configuration System**: Database → localStorage → default configuration chain (Phase 7)

### 🔄 Current Focus
- Quality assurance and error handling
- Performance optimization
- Content validation and testing

## 🗂️ File Organization Summary

**Total Files: ~55**
- **API Routes:** 17+ seeding-related endpoints (including AI configuration)
- **React Hooks:** 13 custom hooks for seeding operations (including AI config management)
- **Utility Functions:** 1 comment processing utility with AI integration
- **Database Services:** 3 core database service files
- **UI Components:** 8 seeding-specific components + admin components
- **Types/Interfaces:** 6 TypeScript definition files
- **Data/Configuration:** 1 persona template file with 20 complete user profiles

## 🎯 Key Entry Points

1. **Admin Interface:** `src/components/admin/SeedingTab.tsx`
2. **API Gateway:** `src/app/api/admin/transform-with-ai/route.ts`
3. **Database Operations:** `src/db/services/seedUserService.ts`
4. **User Personas:** `src/data/seedPersonas.ts`
5. **Execution Logic:** `src/hooks/useSeedingExecution.ts`

This comprehensive file index covers all components of the AI-powered discussion seeding system, from user persona management to content generation, database operations, and admin interfaces.