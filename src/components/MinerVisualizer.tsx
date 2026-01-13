import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

interface MinerModelProps {
  color?: string;
  autoRotate?: boolean;
}

function MinerBox({ color = '#3b82f6', autoRotate = true }: MinerModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fanRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
    fanRefs.current.forEach((fan) => {
      if (fan) {
        fan.rotation.z += delta * 8;
      }
    });
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Main body */}
        <RoundedBox args={[3, 1.5, 2]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Top panel with vents */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[2.8, 0.05, 1.8]} />
          <meshStandardMaterial color="#0f0f1a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Vent lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[-1.2 + i * 0.2, 0.83, 0]}>
            <boxGeometry args={[0.08, 0.02, 1.5]} />
            <meshStandardMaterial color="#2a2a4a" metalness={0.5} roughness={0.5} />
          </mesh>
        ))}

        {/* Front panel */}
        <mesh position={[0, 0, 1.02]}>
          <boxGeometry args={[2.9, 1.4, 0.05]} />
          <meshStandardMaterial color="#0f0f1a" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Fan grilles - front */}
        {[-0.7, 0.7].map((x, idx) => (
          <group key={idx} position={[x, 0, 1.05]}>
            {/* Fan housing */}
            <mesh>
              <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
              <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Fan blades */}
            <mesh
              ref={(el) => { if (el) fanRefs.current[idx] = el; }}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[0.35, 0.05, 8, 6]} />
              <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Center hub */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.12, 16]} />
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.3} />
            </mesh>
          </group>
        ))}

        {/* Back panel with connectors */}
        <mesh position={[0, 0, -1.02]}>
          <boxGeometry args={[2.9, 1.4, 0.05]} />
          <meshStandardMaterial color="#0a0a14" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Power connectors */}
        {[-0.8, 0, 0.8].map((x, idx) => (
          <mesh key={idx} position={[x, 0.3, -1.08]}>
            <boxGeometry args={[0.3, 0.2, 0.1]} />
            <meshStandardMaterial color="#333" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Ethernet port */}
        <mesh position={[1.2, 0.3, -1.08]}>
          <boxGeometry args={[0.15, 0.12, 0.08]} />
          <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Status LEDs */}
        {[
          { x: -1.2, color: '#22c55e' },
          { x: -1.0, color: '#f59e0b' },
          { x: -0.8, color: '#3b82f6' }
        ].map((led, idx) => (
          <mesh key={idx} position={[led.x, 0.5, 1.08]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial
              color={led.color}
              emissive={led.color}
              emissiveIntensity={2}
            />
          </mesh>
        ))}

        {/* Brand label area */}
        <mesh position={[0.5, 0.5, 1.06]}>
          <boxGeometry args={[0.8, 0.15, 0.02]} />
          <meshStandardMaterial color="#2a2a4a" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Side vents */}
        {[-1.52, 1.52].map((x, idx) => (
          <group key={idx}>
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh key={i} position={[x, -0.5 + i * 0.15, 0]}>
                <boxGeometry args={[0.02, 0.08, 1.6]} />
                <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Mounting feet */}
        {[
          [-1.2, -0.8, 0.8],
          [1.2, -0.8, 0.8],
          [-1.2, -0.8, -0.8],
          [1.2, -0.8, -0.8]
        ].map((pos, idx) => (
          <mesh key={idx} position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.1, 0.12, 0.08, 16]} />
            <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

interface MinerVisualizerProps {
  className?: string;
  autoRotate?: boolean;
}

export default function MinerVisualizer({ className = '', autoRotate = true }: MinerVisualizerProps) {
  return (
    <div className={`w-full h-full min-h-[400px] ${className}`}>
      <Canvas
        camera={{ position: [4, 2, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          <pointLight position={[0, 5, 0]} intensity={0.5} color="#3b82f6" />
          
          <MinerBox autoRotate={autoRotate} />
          
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={4}
            maxDistance={10}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
          />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
