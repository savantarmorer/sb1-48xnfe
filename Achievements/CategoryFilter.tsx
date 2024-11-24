import { motion } from 'framer-motion';
import { AchievementCategory } from '../../types/achievements';

interface CategoryFilterProps {
  categories: AchievementCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory
}: CategoryFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-wrap gap-2"
    >
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selectedCategory === null
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        All
      </button>
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
              selectedCategory === category.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Icon size={16} className={selectedCategory === category.id ? 'text-white' : category.color} />
            <span>{category.name}</span>
          </button>
        );
      })}
    </motion.div>
  );
}