import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';
import { motion } from 'framer-motion-3d';

interface LootboxModelProps {
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isOpening: boolean;
  onOpenComplete: () => void;
}

export default function LootboxModel({ rarity, isOpening, onOpenComplete }: LootboxModelProps) {
  const meshRef = useRef<Mesh>(null);
  const { nodes, materials } = useGLTF('/models/lootbox.glb');

  const rarityColors = {
    common: '#9CA3AF',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  };

  useFrame((state) => {
    if (!isOpening && meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <motion.group
      animate={isOpening ? {
        scale: [1, 1.2, 0],
        rotateY: 720,
        y: [0, 2, -2]
      } : {
        scale: 1,
        rotateY: 0,
        y: 0
      }}
      transition={{
        duration: isOpening ? 1.5 : 0.5,
        ease: "easeInOut",
        onComplete: () => isOpening && onOpenComplete()
      }}
    >
      <mesh
        ref={meshRef}
        geometry={nodes.lootbox.geometry}
        material={materials.lootbox}
        scale={[1, 1, 1]}
      >
        <meshStandardMaterial
          color={rarityColors[rarity]}
          metalness={0.8}
          roughness={0.2}
          emissive={rarityColors[rarity]}
          emissiveIntensity={0.2}
        />
      </mesh>
    </motion.group>
  );
}