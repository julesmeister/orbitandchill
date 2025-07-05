/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/PlanetAlignment.tsx
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Body, GeoVector, Observer } from 'astronomy-engine';

interface PlanetData {
  name: string;
  position: THREE.Vector3;
  color: string;
  size: number;
  distance: number;
  angle: number;
}

const Planet = ({ 
  planetData, 
  showLabel = true 
}: { 
  planetData: PlanetData; 
  showLabel?: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const labelRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation animation
      meshRef.current.rotation.y += 0.005;
      
      // Pulsing effect for better visibility
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
    
    // Make label always face camera
    if (labelRef.current && showLabel) {
      labelRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group>
      {/* Planet sphere */}
      <mesh ref={meshRef} position={planetData.position}>
        <sphereGeometry args={[planetData.size, 32, 32]} />
        <meshStandardMaterial 
          color={planetData.color} 
          emissive={planetData.color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Planet label */}
      {showLabel && (
        <group ref={labelRef} position={[planetData.position.x, planetData.position.y + planetData.size + 1, planetData.position.z]}>
          <Text
            color="white"
            fontSize={0.8}
            maxWidth={200}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            {planetData.name}
          </Text>
        </group>
      )}
      
      {/* Orbital glow effect */}
      <mesh position={planetData.position}>
        <sphereGeometry args={[planetData.size * 1.5, 16, 16]} />
        <meshBasicMaterial 
          color={planetData.color} 
          transparent 
          opacity={0.2}
        />
      </mesh>
    </group>
  );
};

const OrbitRing = ({ radius, color = "rgba(255,255,255,0.1)" }: { radius: number; color?: string }) => {
  const ringRef = useRef<THREE.Mesh>(null!);
  
  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.001;
    }
  });

  return (
    <>
      {/* Main orbit ring on XZ plane */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.15, radius + 0.15, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Additional ring for better visibility from side angles */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.05, 8, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </>
  );
};

// Define only the celestial bodies we want to display
type DisplayBody = Body.Mercury | Body.Venus | Body.Earth | Body.Mars | 
                  Body.Jupiter | Body.Saturn | Body.Uranus | Body.Neptune | Body.Pluto;

// Planet configuration with realistic relative sizes and distances
const PLANET_CONFIG: Record<DisplayBody, { color: string; size: number; baseDistance: number }> = {
  [Body.Mercury]: { color: '#8C6B47', size: 0.3, baseDistance: 4 },
  [Body.Venus]: { color: '#FFC649', size: 0.4, baseDistance: 6 },
  [Body.Earth]: { color: '#4F94CD', size: 0.5, baseDistance: 8 },
  [Body.Mars]: { color: '#CD5C5C', size: 0.35, baseDistance: 10 },
  [Body.Jupiter]: { color: '#DAA520', size: 1.2, baseDistance: 14 },
  [Body.Saturn]: { color: '#FAD5A5', size: 1.0, baseDistance: 18 },
  [Body.Uranus]: { color: '#4FD0E7', size: 0.8, baseDistance: 22 },
  [Body.Neptune]: { color: '#4169E1', size: 0.8, baseDistance: 26 },
  [Body.Pluto]: { color: '#8B7D6B', size: 0.2, baseDistance: 30 }
};

const PlanetAlignment: React.FC = () => {
  const [planetData, setPlanetData] = useState<PlanetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculatePlanetPositions = () => {
      try {
        setLoading(true);
        const today = new Date();
        const planetNames: DisplayBody[] = [
          Body.Mercury, Body.Venus, Body.Earth, Body.Mars,
          Body.Jupiter, Body.Saturn, Body.Uranus, Body.Neptune, Body.Pluto,
        ];

        const calculatedPlanets = planetNames.map((planetBody, index) => {
          const config = PLANET_CONFIG[planetBody];
          
          try {
            // Calculate heliocentric position for better visualization
            const vector = GeoVector(planetBody, today, false);
            
            // Convert to cylindrical coordinates for better spread
            const distance = Math.sqrt(vector.x * vector.x + vector.y * vector.y) / 1e8; // Scale factor
            const angle = Math.atan2(vector.y, vector.x);
            
            // Use a combination of real position and ideal spacing for visualization
            const visualDistance = config.baseDistance + (distance * 2);
            const visualAngle = angle + (index * 0.2); // Add slight offset for spacing
            
            const position = new THREE.Vector3(
              Math.cos(visualAngle) * visualDistance,
              (vector.z / 1e8) * 0.5, // Minimal vertical spread to keep planets near orbital plane
              Math.sin(visualAngle) * visualDistance
            );

            return {
              name: Body[planetBody] as string,
              position,
              color: config.color,
              size: config.size,
              distance: visualDistance,
              angle: visualAngle,
            };
          } catch (error) {
            console.warn(`Error calculating position for ${Body[planetBody]}:`, error);
            
            // Fallback to orbital arrangement
            const fallbackAngle = (index / planetNames.length) * Math.PI * 2;
            const fallbackDistance = config.baseDistance;
            
            return {
              name: Body[planetBody] as string,
              position: new THREE.Vector3(
                Math.cos(fallbackAngle) * fallbackDistance,
                0,
                Math.sin(fallbackAngle) * fallbackDistance
              ),
              color: config.color,
              size: config.size,
              distance: fallbackDistance,
              angle: fallbackAngle,
            };
          }
        });

        setPlanetData(calculatedPlanets);
        setError(null);
      } catch (err) {
        console.error('Error calculating planet alignment:', err);
        setError('Unable to calculate current planet positions');
      } finally {
        setLoading(false);
      }
    };

    calculatePlanetPositions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white border border-black">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-gray-300 border-t-black mx-auto mb-4"></div>
          <p className="text-black font-medium">Calculating planetary positions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-white border border-black">
        <div className="text-center">
          <p className="text-xl mb-2 text-black font-bold">⚠️ {error}</p>
          <p className="text-sm text-gray-600">Showing approximate planetary arrangement</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold border border-black">
            Live Solar System
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 font-space-grotesk">
          Current Planetary
          <span className="block">Alignment</span>
        </h2>
        <p className="text-gray-700 text-lg">
          Real-time positions of planets in our solar system • {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* 3D Solar System View */}
      <div className="relative h-96 w-full bg-gradient-to-b from-slate-900 via-purple-900 to-indigo-900 border border-black overflow-hidden">
        <Canvas
          camera={{ position: [30, 35, 45], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ camera }) => {
            camera.lookAt(0, 0, 0);
          }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 0, 0]} intensity={2} color="#FFEB3B" />
          <pointLight position={[50, 50, 50]} intensity={0.5} color="#E3F2FD" />

          {/* Orbit Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.8}
            rotateSpeed={0.4}
          />

          {/* Sun */}
          <group>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[2, 32, 32]} />
              <meshStandardMaterial 
                color="#FFEB3B" 
                emissive="#FF9800" 
                emissiveIntensity={0.8}
              />
            </mesh>
            
            {/* Sun glow */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[3, 16, 16]} />
              <meshBasicMaterial 
                color="#FFEB3B" 
                transparent 
                opacity={0.1}
              />
            </mesh>
            
            {/* Sun label */}
            <group position={[0, 4, 0]}>
              <Text
                color="#FFEB3B"
                fontSize={1.2}
                fontWeight="bold"
                textAlign="center"
                anchorX="center"
                anchorY="middle"
              >
                ☀️ Sun
              </Text>
            </group>
          </group>

          {/* Orbital rings */}
          {planetData.map((planet, index) => (
            <OrbitRing 
              key={`orbit-${planet.name}`} 
              radius={planet.distance}
              color={`${planet.color}40`}
            />
          ))}

          {/* Planets */}
          {planetData.map((planet) => (
            <Planet 
              key={planet.name} 
              planetData={planet} 
              showLabel={true}
            />
          ))}

          {/* Background stars */}
          <Stars />
        </Canvas>

        {/* Controls hint */}
        <div className="absolute bottom-4 right-4 text-white text-xs bg-black/50 px-3 py-2 border border-white/20">
          <p>🖱️ Drag to rotate • 🔍 Scroll to zoom • 🎯 Double-click to reset</p>
        </div>
      </div>

      {/* Planet Information Cards */}
      <div className="mt-8 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 bg-white">
        {planetData.map((planet, index) => {
          return (
            <div 
              key={planet.name}
              className="group text-center"
            >
              {/* Planet sphere */}
              <div className="flex justify-center mb-3">
                <div 
                  className="w-12 h-12 rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{ 
                    background: `linear-gradient(135deg, ${planet.color}ff 0%, ${planet.color}cc 50%, ${planet.color}88 100%)`
                  }}
                >
                </div>
              </div>
              
              {/* Planet name */}
              <h3 className="text-black font-semibold text-xs text-center mb-2 font-space-grotesk">
                {planet.name}
              </h3>
              
              {/* Distance indicator */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                <div 
                  className="w-3 h-1"
                  style={{ backgroundColor: planet.color }}
                ></div>
                <span className="font-medium">{planet.distance.toFixed(1)}AU</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Data Section */}
      <div className="mt-12">
        {/* Main Status Display */}
        <div className="bg-white border border-black p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-black mb-3 font-space-grotesk">
              Live Solar System Data
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-black animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Real-time calculations active</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-8 border border-black overflow-hidden">
            <div className="group text-center p-8 border-r border-black hover:bg-gray-50 transition-all duration-300 relative">
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
              <div className="text-6xl font-black text-black mb-3 font-space-grotesk">{planetData.length}</div>
              <div className="text-black text-sm font-bold uppercase tracking-wider font-open-sans">Planets</div>
              <div className="text-gray-600 text-xs mt-2">Live tracking</div>
            </div>
            <div className="group text-center p-8 md:border-r border-black hover:bg-gray-50 transition-all duration-300 relative">
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
              <div className="text-6xl font-black text-black mb-3 font-space-grotesk">360°</div>
              <div className="text-black text-sm font-bold uppercase tracking-wider font-open-sans">View</div>
              <div className="text-gray-600 text-xs mt-2">Full rotation</div>
            </div>
            <div className="group text-center p-8 border-r border-black hover:bg-gray-50 transition-all duration-300 relative">
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
              <div className="text-6xl font-black text-black mb-3 font-space-grotesk">3D</div>
              <div className="text-black text-sm font-bold uppercase tracking-wider font-open-sans">Space</div>
              <div className="text-gray-600 text-xs mt-2">Interactive</div>
            </div>
            <div className="group text-center p-8 hover:bg-gray-50 transition-all duration-300 relative">
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
              <div className="text-6xl font-black text-black mb-3 font-space-grotesk">
                {new Date().getDate()}
              </div>
              <div className="text-black text-sm font-bold uppercase tracking-wider font-open-sans">
                {new Date().toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
              </div>
              <div className="text-gray-600 text-xs mt-2">{new Date().getFullYear()}</div>
            </div>
            
            {/* Features Row */}
            <div className="group relative p-6 text-center hover:bg-gray-50 transition-all duration-300 border-r border-black border-t border-black">
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
              <div className="text-3xl mb-3">🪐</div>
              <div className="text-black font-bold text-sm font-space-grotesk">Heliocentric positioning</div>
            </div>
            <div className="group relative p-6 text-center hover:bg-gray-50 transition-all duration-300 md:border-r border-black border-t border-black">
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
              <div className="text-3xl mb-3">⚡</div>
              <div className="text-black font-bold text-sm font-space-grotesk">Astronomy-engine powered</div>
            </div>
            <div className="group relative p-6 text-center hover:bg-gray-50 transition-all duration-300 border-r border-black border-t border-black">
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
              <div className="text-3xl mb-3">🎮</div>
              <div className="text-black font-bold text-sm font-space-grotesk">Drag • Zoom • Explore</div>
            </div>
            <div className="group relative p-6 text-center hover:bg-gray-50 transition-all duration-300 border-t border-black">
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
              <div className="text-3xl mb-3">✨</div>
              <div className="text-black font-bold text-sm font-space-grotesk">Orbital mechanics</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-0 bg-white border border-black overflow-hidden">
          <div className="group p-6 text-center border-r border-black hover:bg-gray-50 transition-all duration-300 relative">
            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
            <div className="text-3xl mb-2">☀️</div>
            <div className="text-black font-bold text-sm mb-1 font-space-grotesk">Central Star</div>
            <div className="text-gray-600 text-xs">Solar center</div>
          </div>
          <div className="group p-6 text-center md:border-r border-black hover:bg-gray-50 transition-all duration-300 relative">
            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
            <div className="text-3xl mb-2">🌍</div>
            <div className="text-black font-bold text-sm mb-1 font-space-grotesk">Rocky Planets</div>
            <div className="text-gray-600 text-xs">4 inner worlds</div>
          </div>
          <div className="group p-6 text-center border-r border-black hover:bg-gray-50 transition-all duration-300 relative">
            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
            <div className="text-3xl mb-2">🪐</div>
            <div className="text-black font-bold text-sm mb-1 font-space-grotesk">Gas Giants</div>
            <div className="text-gray-600 text-xs">4 outer worlds</div>
          </div>
          <div className="group p-6 text-center hover:bg-gray-50 transition-all duration-300 relative">
            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
            <div className="text-3xl mb-2">🌌</div>
            <div className="text-black font-bold text-sm mb-1 font-space-grotesk">Dwarf Planet</div>
            <div className="text-gray-600 text-xs">Pluto included</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stars background component
const Stars = () => {
  const starsRef = useRef<THREE.Points>(null!);
  
  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    for (let i = 0; i < 1000; i++) {
      vertices.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    if (starsRef.current) {
      starsRef.current.geometry = geometry;
    }
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry />
      <pointsMaterial color="white" size={0.5} />
    </points>
  );
};

export default PlanetAlignment;
