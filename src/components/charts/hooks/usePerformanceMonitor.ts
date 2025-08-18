/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime?: number;
  mountTime?: number;
}

export function usePerformanceMonitor(componentName: string) {
  const startTimeRef = useRef<number>(0);
  const mountTimeRef = useRef<number>(0);

  // Start timing on component mount
  useEffect(() => {
    mountTimeRef.current = performance.now();
    
    return () => {
      // Cleanup timing on unmount
      const unmountTime = performance.now();
      const totalLifetime = unmountTime - mountTimeRef.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 Performance: ${componentName} lifecycle: ${totalLifetime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  // Measure render performance
  const measureRender = () => {
    if (process.env.NODE_ENV === 'development') {
      startTimeRef.current = performance.now();
      
      // Use requestAnimationFrame to measure after render
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const renderTime = endTime - startTimeRef.current;
        
        if (renderTime > 16) { // Flag renders taking longer than one frame (16ms)
          console.warn(`⚠️  Performance: ${componentName} slow render: ${renderTime.toFixed(2)}ms`);
        } else {
          console.log(`✅ Performance: ${componentName} render: ${renderTime.toFixed(2)}ms`);
        }
      });
    }
  };

  return { measureRender };
}

export function withPerformanceMonitor<T extends object>(
  Component: React.ComponentType<T>,
  componentName?: string
): React.ComponentType<T> {
  const WrappedComponent = (props: T) => {
    const name = componentName || Component.displayName || Component.name || 'UnknownComponent';
    const { measureRender } = usePerformanceMonitor(name);
    
    useEffect(() => {
      measureRender();
    });

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withPerformanceMonitor(${componentName || Component.displayName || Component.name})`;
  
  return WrappedComponent;
}