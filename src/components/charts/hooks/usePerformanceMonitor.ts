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
  }, [componentName]);

  // Measure render performance (performance monitoring disabled)
  const measureRender = () => {
    // Performance monitoring disabled to reduce console noise
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