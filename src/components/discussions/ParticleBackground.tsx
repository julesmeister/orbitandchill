"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

const PARTICLE_COUNT = 150;
const PARTICLE_SPEED = 0.2;
const CONNECTION_DISTANCE = 200;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SPECIAL_CONNECTION_DISTANCE = 250;

// Simple spring animation utility
class SpringValue {
  private current: number = 0;
  private target: number = 0;
  private velocity: number = 0;
  private stiffness: number = 0.1;
  private damping: number = 0.8;

  constructor(stiffness = 0.1, damping = 0.8) {
    this.stiffness = stiffness;
    this.damping = damping;
  }

  set(value: number) {
    this.target = value;
  }

  get(): number {
    return this.current;
  }

  update() {
    const force = (this.target - this.current) * this.stiffness;
    this.velocity += force;
    this.velocity *= this.damping;
    this.current += this.velocity;
  }
}

class Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  baseX: number;
  baseY: number;
  density: number;
  angle: number;
  speed: number;
  isSpecialParticle: boolean;

  constructor(x: number, y: number, radius: number, color: string, isSpecialParticle = false) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.baseX = x;
    this.baseY = y;
    this.density = Math.random() * 30 + 1;
    this.angle = Math.random() * 360;
    this.speed = PARTICLE_SPEED;
    this.isSpecialParticle = isSpecialParticle;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  }

  update(time: number, rotationX = 0, rotationY = 0) {
    this.angle += this.speed;
    const radian = (this.angle * Math.PI) / 180;
    
    // Base orbital movement
    const orbitX = Math.cos(radian + time) * 30;
    const orbitY = Math.sin(radian + time) * 30;
    
    // Add rotation influence with spring-like movement
    const rotationInfluenceX = rotationY * 50;
    const rotationInfluenceY = rotationX * 50;
    
    // Combine movements
    this.x = this.baseX + orbitX + rotationInfluenceX;
    this.y = this.baseY + orbitY + rotationInfluenceY;
  }
}

interface ParticleBackgroundProps {
  className?: string;
}

export default function ParticleBackground({ className = '' }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const startTime = useRef(Date.now());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  
  // Spring animation values for mouse tracking
  const rotationX = useRef(new SpringValue(0.05, 0.9));
  const rotationY = useRef(new SpringValue(0.05, 0.9));
  
  // Throttle function for performance
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const throttle = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any[]) => {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay - (currentTime - lastExecTime));
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize particles with different types
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const particles: Particle[] = [];
    const { width, height } = dimensions;
    const centerX = width * 0.7; // Offset center like original
    const centerY = height * 0.3;

    // Create more background particles
    for (let i = 0; i < PARTICLE_COUNT * 0.7; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 1.5 + 0.5;
      const color = 'rgba(255, 255, 255, 0.12)';
      particles.push(new Particle(x, y, radius, color, false));
    }

    // Create special particles concentrated around offset center
    for (let i = 0; i < PARTICLE_COUNT * 0.3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 300 + 50;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const radius = Math.random() * 1.5 + 1;
      const color = 'rgba(255, 255, 255, 0.15)';
      particles.push(new Particle(x, y, radius, color, true));
    }

    particlesRef.current = particles;
  }, [dimensions]);

  // Enhanced mouse movement with spring animation
  useEffect(() => {
    const handleMouseMove = throttle((event: MouseEvent) => {
      const position = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      };

      rotationX.current.set(position.y / 2);
      rotationY.current.set(position.x / 2);
    }, 100);

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [throttle]);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    context.scale(dpr, dpr);

    return () => {
      context.clearRect(0, 0, dimensions.width, dimensions.height);
    };
  }, [dimensions]);

  // Enhanced drawing function with gradients
  const drawParticles = useCallback((context: CanvasRenderingContext2D, time: number) => {
    const particles = particlesRef.current;

    // Update spring values
    rotationX.current.update();
    rotationY.current.update();

    // Update and draw particles
    particles.forEach(particle => {
      particle.update(time, rotationX.current.get(), rotationY.current.get());
      particle.draw(context);
    });

    // Create gradient for connections
    const createGradient = (x1: number, y1: number, x2: number, y2: number, opacity: number) => {
      const gradient = context.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.5})`);
      return gradient;
    };

    // Draw enhanced connections between particles
    particles.forEach((particle1, i) => {
      particles.slice(i + 1).forEach(particle2 => {
        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONNECTION_DISTANCE) {
          const opacity = particle1.isSpecialParticle || particle2.isSpecialParticle
            ? 0.2 * (1 - distance / CONNECTION_DISTANCE)
            : 0.08 * (1 - distance / CONNECTION_DISTANCE);

          context.beginPath();
          context.strokeStyle = createGradient(
            particle1.x, particle1.y,
            particle2.x, particle2.y,
            opacity
          );
          context.lineWidth = particle1.isSpecialParticle || particle2.isSpecialParticle ? 1.2 : 0.8;
          context.moveTo(particle1.x, particle1.y);
          context.lineTo(particle2.x, particle2.y);
          context.stroke();
        }
      });
    });
  }, []);

  // Enhanced animation loop
  useEffect(() => {
    const animate = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context || dimensions.width === 0) return;

      context.clearRect(0, 0, dimensions.width, dimensions.height);

      const time = 0.00005 * (Date.now() - startTime.current);
      drawParticles(context, time);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, drawParticles]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
        aria-hidden="true"
      />
    </div>
  );
}