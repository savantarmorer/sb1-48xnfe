/**
 * Achievements Component
 * 
 * This component uses a normalized data structure for achievements where:
 * 1. Each achievement has:
 *    - prerequisites: IDs of achievements that must be unlocked first
 *    - dependents: IDs of achievements that depend on this one
 *    - triggerConditions: Array of conditions that must be met to unlock
 *    - order: Number indicating display order within its category
 * 
 * Dependencies:
 * - useLanguage: For internationalization
 * - useAchievements: For achievement state and logic
 * - ACHIEVEMENT_CATEGORIES: For category metadata
 * 
 * Used by:
 * - App.tsx (main achievement display)
 * - UserProfile (achievement showcase)
 */

import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Award, Lock, CheckCircle } from 'lucide-react';
import { useAchievements } from '../../hooks/useAchievements';
import { ACHIEVEMENT_CATEGORIES } from '../Achievements/AchievementSystem';
import type { AchievementCategory } from '../../types/achievements';

export function Achievements() {
  const { t } = useLanguage();
  const { achievements } = useAchievements();

  /**
   * Group achievements by category using normalized structure
   * This creates an object where keys are category IDs and values are arrays of achievements
   * Used for organizing achievements in the UI
   */
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    const category = achievement.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {} as Record<string, typeof achievements>);

  /**
   * Helper function to render category icons
   * Uses the ACHIEVEMENT_CATEGORIES constant for icon and color information
   * Returns null if category doesn't exist or has no icon
   */
  const renderCategoryIcon = (category: string) => {
    const categoryData = ACHIEVEMENT_CATEGORIES[category] as AchievementCategory;
    if (!categoryData?.icon) return null;
    
    const Icon = categoryData.icon;
    return (
      <Icon 
        className={categoryData.color} 
        size={20} 
      />
    );
  };

  return (
    <div className="card">
      {/* Header with total progress */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading text-xl">{t('common.achievements')}</h2>
        <div className="text-sm text-muted">
          {achievements.filter(a => a.unlocked).length} / {achievements.length} {t('common.unlocked')}
        </div>
      </div>

      {/* Achievement categories and their achievements */}
      <div className="space-y-6">
        {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
          <div key={category} className="space-y-4">
            {/* Category header with icon */}
            <div className="flex items-center space-x-2">
              {renderCategoryIcon(category)}
              <h3 className="font-semibold">
                {ACHIEVEMENT_CATEGORIES[category]?.name || category}
              </h3>
            </div>

            {/* Achievement cards for this category */}
            <div className="space-y-4">
              {categoryAchievements
                .sort((a, b) => a.order - b.order) // Sort by defined order
                .map(achievement => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.02 }}
                  className={`achievement-card ${achievement.rarity}`}
                >
                  {/* Achievement header with status icon */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        {achievement.unlocked ? (
                          <CheckCircle size={20} className="text-brand-teal-500 dark:text-brand-teal-400" />
                        ) : (
                          <Lock size={20} className="text-gray-400 dark:text-gray-500" />
                        )}
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {achievement.title}
                        </h3>
                      </div>
                      <p className="text-muted mt-1 ml-7">{achievement.description}</p>
                      
                      {/* Prerequisites display */}
                      {achievement.prerequisites.length > 0 && (
                        <p className="text-xs text-muted mt-1 ml-7">
                          Requires: {achievement.prerequisites.map(preId => {
                            const prereq = achievements.find(a => a.id === preId);
                            return prereq?.title;
                          }).join(', ')}
                        </p>
                      )}
                    </div>
                    
                    {/* Points display */}
                    <div className="flex items-center space-x-2">
                      <Award size={20} className="text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        +{achievement.points} points
                      </span>
                    </div>
                  </div>

                  {/* Progress bar for incomplete achievements */}
                  {achievement.progress !== undefined && !achievement.unlocked && (
                    <div className="mt-3 ml-7">
                      <div className="flex justify-between text-xs text-muted mb-1">
                        <span>{t('common.progress')}</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div
                          className="progress-bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}