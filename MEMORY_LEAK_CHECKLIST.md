# Memory Leak Prevention & Diagnostic Checklist

## 🚨 Current Memory Issues Detected

Your application is showing **critical memory leak symptoms**:
- **High heap usage: 96-98%** (Normal: <80%)
- **Sustained memory growth** without cleanup
- **Connection pool churn** (constantly creating/removing connections)
- **Multiple monitoring instances** running simultaneously

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

### 4. **NEW ISSUES IDENTIFIED** 🔍 INVESTIGATING
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