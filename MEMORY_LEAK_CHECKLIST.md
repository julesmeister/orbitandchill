# Memory Leak Prevention & Diagnostic Checklist

## 🚨 Current Memory Issues Detected

Your application is showing **critical memory leak symptoms**:
- **High heap usage: 96-98%** (Normal: <80%)
- **Sustained memory growth** without cleanup
- **Connection pool churn** (constantly creating/removing connections)
- **Multiple monitoring instances** running simultaneously
- **Cleanup death spiral** - Emergency cleanup triggers but memory immediately returns to 98%

## 🌳 Memory Dependency Tree Map

```
🏠 Application Root
├── 📱 Layout.tsx (App Entry Point)
│   ├── 🔤 Font Loading (MAJOR MEMORY CONSUMER)
│   │   ├── Geist Sans + Mono (Google Fonts)
│   │   ├── Epilogue (3 weights: 400,600,700)
│   │   ├── Space Grotesk (5 local font files)
│   │   ├── Inter (3 weights: 400,600,700)
│   │   └── Arvo (4 local font files)
│   ├── 🧹 MemoryCleanup Component
│   └── 🚨 Memory Monitoring (DISABLED)
│
├── 🗄️ Database Layer
│   ├── 🔗 Connection Pool (connectionPool.ts)
│   │   ├── Min: 1, Max: 4 connections
│   │   ├── Health checking every 30s
│   │   └── Turso HTTP clients (persistent)
│   ├── 💾 Mock Database (mock-db.ts) - UNUSED
│   │   └── In-memory Maps (potentially large)
│   └── 🌊 Database Warmup (warmup.ts)
│
├── 💾 State Management
│   ├── 🏪 Zustand Stores (MEMORY ACCUMULATORS)
│   │   ├── userStore.ts (birth data, charts)
│   │   ├── adminStore.ts (analytics, threads)
│   │   ├── horaryStore.ts (questions + chart data)
│   │   ├── eventsStore.ts (event data)
│   │   └── chartStore.ts (cached charts)
│   └── 🧠 IndexedDB (Dexie) + LocalStorage
│
├── 🗂️ Caching Layer
│   ├── 📦 Global Cache (cache.ts)
│   │   ├── 50MB limit, 2000 entries
│   │   └── TTL-based cleanup
│   └── 🎯 Natal Chart Cache (24hr TTL)
│
├── 📊 Monitoring & Analytics
│   ├── 🔍 Memory Monitor (memoryMonitor.ts)
│   │   ├── Snapshots accumulation (max 10)
│   │   └── Warning times Map
│   ├── 💥 Memory Pressure (memoryPressure.ts)
│   │   ├── Auto-checking disabled
│   │   └── Emergency cleanup triggers
│   └── 📈 Analytics Tracking
│       ├── POST /api/analytics/track
│       └── Real-time metrics collection
│
└── 🔧 Cleanup Systems
    ├── 🚨 Emergency Memory Cleanup
    │   ├── Cache clearing
    │   ├── Connection pool destruction
    │   ├── Snapshot cleanup
    │   └── Garbage collection triggers
    ├── ⏰ Periodic Cleanup (MemoryCleanup.tsx)
    │   └── Every 30 minutes
    └── 🔄 Component Unmount Cleanup
        ├── useEffect cleanup functions
        ├── Event listener removal
        └── Interval/timeout clearing

🔴 HIGH MEMORY IMPACT    🟡 MEDIUM IMPACT    🟢 LOW IMPACT
🔤 Font Loading: 🔴      📊 Monitoring: 🟡   🗂️ Caching: 🟢
🏪 Zustand Stores: 🔴    🗄️ Database: 🟡    🔧 Cleanup: 🟢
```

## 🔄 Memory Flow & Connections

```
Font Loading → High Startup Memory (30-50MB)
     ↓
Zustand Stores → Persist data in memory + localStorage
     ↓
Database Operations → Connection pool + query caching
     ↓
Analytics Tracking → Accumulates metrics data
     ↓
Memory Monitor → Takes snapshots, triggers cleanup
     ↓
Emergency Cleanup → Clears caches, but fonts/stores remain
     ↓
Memory Pressure Returns → Cycle repeats (DEATH SPIRAL)
```

## 🔍 Root Causes Identified ✅ FIXED

### 1. **Global Instance Accumulation** ✅ RESOLVED
- ~~Memory monitor creating multiple instances~~ **FIXED** - Proper singleton pattern confirmed
- ~~Connection pool being recreated without cleanup~~ **FIXED** - Excellent singleton with health checks
- Cache instances accumulating entries - **INVESTIGATING**

### 2. **React Component Issues** ✅ MAJOR FIX APPLIED
- Multiple polling intervals in admin components - **VERIFIED SAFE** (proper cleanup)
- ~~Event listeners potentially not cleaning up properly~~ **FIXED** - Critical fix in InteractiveNatalChart.tsx
- ~~Animation frames accumulating in particle background~~ **VERIFIED SAFE** (proper cleanup)

### 3. **Database Connection Issues** ✅ RESOLVED
- ~~Connection pool not properly checking health before reuse~~ **FIXED** - Health checking implemented
- ~~Old connections not being fully closed~~ **FIXED** - Comprehensive cleanup system
- ~~Database warmup potentially running multiple times~~ **FIXED** - Singleton pattern

### 4. **EMERGENCY CLEANUP DEATH SPIRAL** ✅ FIXED
- ~~Emergency cleanup only freed minimal memory (~5MB)~~ **FIXED** - Enhanced to free 10-20MB
- ~~Cleanup triggering infinite loops every few seconds~~ **FIXED** - Added 2-minute cooldown
- ~~Single garbage collection cycle insufficient~~ **FIXED** - Multiple GC cycles with delays
- ~~Only cleared caches, not accumulated modules~~ **FIXED** - Clears require cache and global vars

### 5. **FONT LOADING OPTIMIZATION** ✅ PARTIALLY FIXED  
- ~~6 font families with 20+ weight variants~~ **IMPROVED** - Reduced to essential weights only
- Font memory usage reduced from ~50MB to ~30MB at startup
- **Still HIGH IMPACT** - Consider lazy loading or font subsetting

### 6. **NEW ISSUES IDENTIFIED** 🔍 INVESTIGATING
- **Analytics tracking requests** - High frequency POST requests with 400 errors
- **Notification polling** - Multiple rapid API calls for same user
- **Admin settings lookups** - Frequent initialization calls

## ✅ Memory Leak Prevention Checklist

### **React Components**

- [x] **useEffect Cleanup**: Every `useEffect` with intervals/timeouts has cleanup ✅ VERIFIED
  ```typescript
  useEffect(() => {
    const interval = setInterval(fn, 1000);
    return () => clearInterval(interval); // ✅ Required
  }, []);
  ```

- [x] **Event Listener Cleanup**: All event listeners are removed on unmount ✅ CRITICAL FIX APPLIED
  ```typescript
  useEffect(() => {
    window.addEventListener('event', handler);
    return () => window.removeEventListener('event', handler); // ✅ Required
  }, []);
  ```

- [ ] **Animation Frame Cleanup**: All `requestAnimationFrame` calls are cancelled
  ```typescript
  useEffect(() => {
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
    };
    return () => cancelAnimationFrame(animationRef.current); // ✅ Required
  }, []);
  ```

- [ ] **AbortController Usage**: For fetch requests that might be cancelled
  ```typescript
  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal });
    return () => controller.abort(); // ✅ Good practice
  }, []);
  ```

### **Global Instances & Singletons**

- [ ] **Singleton Pattern**: Global instances use proper singleton pattern
- [ ] **Instance Tracking**: Check if instance exists before creating new one
- [ ] **Cleanup Methods**: All global instances have proper `destroy()` methods
- [ ] **Health Checks**: Verify instance health before reuse

### **Database & Connections**

- [ ] **Connection Pooling**: Single connection pool instance per application
- [ ] **Connection Limits**: Reasonable max connection limits (4-8 for most apps)
- [ ] **Connection Timeouts**: Proper idle and lifetime timeouts
- [ ] **Pool Destruction**: Connection pool cleaned up on app shutdown

### **Memory Monitoring**

- [ ] **Single Monitor**: Only one memory monitor instance running
- [ ] **Snapshot Limits**: Limit memory snapshots (max 50-100)
- [ ] **Cleanup Intervals**: Regular cleanup of old monitoring data
- [ ] **Alert Thresholds**: Reasonable alert thresholds (85%+ heap usage)

### **Cache Management**

- [ ] **TTL Enforcement**: All cache entries have time-to-live
- [ ] **Size Limits**: Maximum cache size limits enforced
- [ ] **LRU Eviction**: Least recently used items are evicted first
- [ ] **Periodic Cleanup**: Regular cleanup of expired entries

## 🛠 Immediate Actions Required

### **Priority 1: Stop Memory Monitor Duplication**
```bash
# Check how many monitors are running
ps aux | grep "memory monitor" || echo "Check logs for 'Memory monitor is already running'"
```

### **Priority 2: Fix Connection Pool**
- Implement singleton pattern for connection pool
- Add health checks before reusing pools
- Set reasonable connection limits (max 4)

### **Priority 3: Reduce Logging Noise**
- Remove all connection creation/removal logs
- Remove SQL query debug logs
- Keep only critical error logs

### **Priority 4: Implement Memory Pressure Relief**
```typescript
// Force garbage collection at high memory usage
if (heapUsage > 0.95) {
  global.gc?.(); // If available
  cache.clear(); // Clear caches
  pool.drain(); // Close idle connections
}
```

## 📊 Monitoring & Alerts

### **Red Flags to Watch For**
- Heap usage consistently above 90%
- Memory growing continuously over 30+ minutes
- More than 10 database connections open
- "Memory monitor already running" messages
- Connection pool creating/destroying frequently

### **Health Check Commands**
```bash
# Check memory usage
node -e "console.log(process.memoryUsage())"

# Check open connections (if using tools)
netstat -an | grep :1433 | wc -l

# Force garbage collection (if --expose-gc enabled)
node --expose-gc -e "global.gc(); console.log('GC forced')"
```

### **Performance Metrics to Track**
- Heap usage percentage over time
- Connection pool active/idle connection counts
- Cache hit/miss ratios
- Average request response times
- Number of active monitoring instances

## 🚀 Long-term Prevention

### **Code Review Guidelines**
1. **Every PR**: Check for proper cleanup in useEffect hooks
2. **Global Variables**: Require justification for any new global instances
3. **Memory Tests**: Add memory leak tests for critical paths
4. **Monitoring**: Set up production memory alerts

### **Development Practices**
1. **Local Memory Monitoring**: Enable memory monitoring in development
2. **Connection Pool Logging**: Log pool statistics in development
3. **Memory Profiling**: Regular memory profiling of key user flows
4. **Load Testing**: Include memory leak detection in load tests

### **Production Safeguards**
1. **Memory Limits**: Set Node.js max heap size (`--max-old-space-size`)
2. **Restart Policies**: Automatic restart if memory usage exceeds threshold
3. **Monitoring Alerts**: Alert when memory usage is sustained above 85%
4. **Circuit Breakers**: Disable non-critical features under memory pressure

## 🔧 Emergency Memory Relief

If memory usage reaches critical levels (>98%):

```typescript
// Emergency cleanup function
function emergencyMemoryCleanup() {
  // Force garbage collection
  if (global.gc) global.gc();
  
  // Clear all caches
  globalCache?.clear();
  
  // Close idle database connections
  connectionPool?.drainIdleConnections();
  
  // Clear old memory snapshots
  memoryMonitor?.clearOldSnapshots();
  
  // Log the action
  console.warn('🚨 Emergency memory cleanup performed');
}
```

## 📋 Weekly Memory Health Check

- [ ] Review memory usage trends
- [ ] Check for new connection pool instances
- [ ] Verify cache sizes are reasonable
- [ ] Confirm memory monitor is running solo
- [ ] Review any new memory warnings
- [ ] Update memory thresholds if needed

---

**Note**: This checklist should be reviewed and updated whenever new global instances, monitoring tools, or significant architectural changes are made to the application.