import React from 'react';
import { motion } from 'framer-motion';
import { useLevelSystem } from '../../hooks/useLevelSystem';

export default function LevelProgress() {
  const { currentLevel, progress, xpToNextLevel } = useLevelSystem();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Level {currentLevel}</span>
        <span className="text-xs text-gray-600">{xpToNextLevel} XP to next level</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/**
 * Component Dependencies:
 * - useLevelSystem: Provides all level and XP calculations
 * - GameContext: Source of XP and level data
 * - Framer Motion: Handles progress bar animations
 * 
 * Used By:
 * - UserProfile component
 * - Dashboard component
 * - Achievement system (for level-based achievements)
 * 
 * Updates:
 * - On XP gain
 * - On level up
 * - When progress changes
 * 
 * Role in System:
 * - Visual representation of user progress
 * - Progress tracking for level-based achievements
 * - Part of the core progression system
 */ 