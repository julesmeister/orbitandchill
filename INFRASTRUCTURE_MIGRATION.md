# Infrastructure Brand Migration Guide

This document outlines the migration strategy for all remaining infrastructure-level brand references that were intentionally left during the initial user-facing brand migration.

## Overview

After migrating all user-facing brand references to use the centralized `BRAND` configuration, 21 infrastructure-level references remain. These require careful migration to avoid breaking existing user data and application functionality.

## Remaining Infrastructure References

### 1. Database Class Names
**Files:** `src/store/database.ts`
**Current:** `LuckstrologyDatabase`, `LuckstrologyDB`
**Impact:** Low - Internal class names only
**Migration Strategy:** Safe to rename, no external dependencies

### 2. Storage Keys
**Files:** `src/store/userStore.ts`, `src/store/eventsStore.ts`
**Current:** 
- `luckstrology-user-storage`
- `luckstrology-events-storage`
**Impact:** HIGH - Contains user data in localStorage/IndexedDB
**Migration Strategy:** Requires data migration to preserve user settings

### 3. Session Keys
**Files:** `src/config/auth.ts`
**Current:** `luckstrology_session`
**Impact:** MEDIUM - Users will need to re-login after migration
**Migration Strategy:** Can be changed directly, will invalidate existing sessions

### 4. User Agent Strings
**Files:** `src/utils/reverseGeocoding.ts`
**Current:** `Luckstrology-App/1.0`
**Impact:** Low - External API identification only
**Migration Strategy:** Update to new brand name

### 5. Library Metadata
**Files:** `src/natal/index.ts`
**Current:** Author, homepage, repository references
**Impact:** Low - Package metadata only
**Migration Strategy:** Update when ready to rebrand library

### 6. Admin Settings Default Values
**Files:** `src/db/services/adminSettingsService.ts`
**Current:** Default email addresses with `luckstrology.com`
**Impact:** Low - Default values only, can be overridden
**Migration Strategy:** Update defaults to new domain

### 7. Legacy Component Files
**Files:** `src/app/discussions/page-db.tsx`
**Current:** Document title references
**Impact:** Low - Legacy/unused components
**Migration Strategy:** Remove or update if still in use

## Migration Phases

### Phase 1: Low-Risk Infrastructure (Immediate)
- Database class names
- User agent strings  
- Library metadata
- Legacy component cleanup

### Phase 2: Medium-Risk Infrastructure (Coordinated)
- Session keys (coordinate with deployment)
- Admin default settings

### Phase 3: High-Risk Data Migration (Careful Planning)
- Storage keys with data preservation
- Requires backup and rollback strategy

## Data Migration Strategy

### Storage Key Migration Process

1. **Read existing data** from old storage keys
2. **Validate and transform** data if needed
3. **Write to new storage keys** using new brand naming
4. **Verify migration success**
5. **Clean up old storage keys** after confirmation
6. **Update code** to use new keys

### User Data Preservation

Critical user data that must be preserved:
- User profiles and birth data (`luckstrology-user-storage`)
- Saved events and preferences (`luckstrology-events-storage`)
- Chart history and settings
- Authentication sessions (will be reset)

## Risk Assessment

### High Risk
- **Storage key changes** - Risk of user data loss
- **Database name changes** - Risk of losing existing data

### Medium Risk  
- **Session key changes** - Users need to re-login
- **Domain changes** - External service disruption

### Low Risk
- **Class name changes** - Internal only
- **User agent changes** - External identification only
- **Metadata changes** - Package information only

## Rollback Strategy

### Immediate Rollback (Low Risk Changes)
- Revert code changes
- Redeploy previous version

### Data Migration Rollback (High Risk Changes)
- Restore from backup
- Revert storage key mappings
- Validate data integrity
- Communicate with users if needed

## Testing Strategy

### Pre-Migration Testing
1. **Backup all user data** from localStorage/IndexedDB
2. **Test migration script** in development environment
3. **Verify data integrity** after migration
4. **Test rollback procedure**

### Post-Migration Validation
1. **Verify user data accessibility**
2. **Check new storage keys are working**
3. **Confirm old data is migrated correctly**
4. **Monitor for user reports of data issues**

## Implementation Timeline

### Week 1: Preparation
- [ ] Create migration scripts
- [ ] Test in development environment
- [ ] Prepare backup procedures
- [ ] Document rollback process

### Week 2: Low-Risk Migration
- [ ] Deploy Phase 1 changes
- [ ] Monitor for issues
- [ ] Update documentation

### Week 3: Medium-Risk Migration  
- [ ] Deploy Phase 2 changes
- [ ] Coordinate session invalidation
- [ ] Monitor user experience

### Week 4: High-Risk Data Migration
- [ ] Execute storage key migration
- [ ] Monitor data integrity
- [ ] Cleanup old storage
- [ ] Validate user experience

## Success Criteria

- [ ] All infrastructure references use new brand configuration
- [ ] Zero user data loss during migration
- [ ] No breaking changes to user experience
- [ ] All storage keys successfully migrated
- [ ] Clean separation of old and new branding

## Post-Migration Cleanup

After successful migration:
1. Remove migration scripts and temporary code
2. Update documentation to reflect new infrastructure
3. Monitor for any delayed issues
4. Archive old brand references for historical record

## Support and Monitoring

### User Communication
- Inform users of potential session resets
- Provide clear migration timeline
- Offer support for any data issues

### Technical Monitoring
- Track migration script execution
- Monitor error rates during transition
- Watch for user reports of missing data
- Verify new storage patterns are working

## Emergency Contacts

During migration execution:
- **Technical Lead:** [Contact Info]
- **Data Operations:** [Contact Info]  
- **User Support:** [Contact Info]
- **Rollback Authority:** [Contact Info]

---

*This migration affects core infrastructure and user data. Execute with extreme caution and proper backups.*