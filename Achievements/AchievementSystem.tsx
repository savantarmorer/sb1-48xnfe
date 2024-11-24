import { useState } from 'react';
import { Trophy, Award, Star } from 'lucide-react';
import { useAchievements } from '../../hooks/useAchievements';
import AchievementCard from './AchievementCard';
import AchievementPoints from './AchievementPoints';
import CategoryFilter from './CategoryFilter';
import { AchievementCategory } from '../../types/achievements';

export const ACHIEVEMENT_CATEGORIES: Record<string, AchievementCategory> = {
  progress: {
    id: 'progress',
    name: 'Progress',
    icon: Trophy,
    color: 'text-yellow-500'
  },
  challenges: {
    id: 'challenges',
    name: 'Challenges',
    icon: Award,
    color: 'text-blue-500'
  },
  social: {
    id: 'social',
    name: 'Social',
    icon: Star,
    color: 'text-purple-500'
  }
};

const ACHIEVEMENT_TIERS = [
  { name: 'Bronze', threshold: 0, icon: Award, color: 'text-amber-600' },
  { name: 'Silver', threshold: 1000, icon: Star, color: 'text-gray-400' },
  { name: 'Gold', threshold: 5000, icon: Trophy, color: 'text-yellow-500' }
];

export default function AchievementSystem() {
  const { achievements, totalPoints } = useAchievements();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const currentTier = ACHIEVEMENT_TIERS.reduce((prev, curr) => {
    if (totalPoints >= curr.threshold) return curr;
    return prev;
  }, ACHIEVEMENT_TIERS[0]);

  const nextTier = ACHIEVEMENT_TIERS.find(tier => tier.threshold > totalPoints);

  const filteredAchievements = selectedCategory
    ? achievements.filter(a => a.category === selectedCategory)
    : achievements;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Achievements
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {achievements.filter(a => a.unlocked).length} / {achievements.length} Unlocked
        </div>
      </div>

      <AchievementPoints 
        totalPoints={totalPoints} 
        currentTier={currentTier}
        nextTier={nextTier}
      />

      <CategoryFilter
        categories={Object.values(ACHIEVEMENT_CATEGORIES)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            category={ACHIEVEMENT_CATEGORIES[achievement.category] || ACHIEVEMENT_CATEGORIES.progress}
          />
        ))}
      </div>
    </div>
  );
}