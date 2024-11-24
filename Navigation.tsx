import React from 'react';
import { Trophy, Scroll, Store, User2, Home, Package, Shield, Swords } from 'lucide-react';
import { motion } from 'framer-motion';

type View = 'home' | 'leaderboard' | 'quests' | 'store' | 'profile' | 'inventory' | 'admin';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  showInventory?: boolean;
  isAdmin?: boolean;
}

export default function Navigation({ currentView, onViewChange, showInventory = false, isAdmin = false }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'battle', label: 'Battle', icon: Swords },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'quests', label: 'Quests', icon: Scroll },
    { id: 'store', label: 'Store', icon: Store },
    { id: 'profile', label: 'Profile', icon: User2 }
  ];

  if (showInventory) {
    navItems.push({ id: 'inventory', label: 'Inventory', icon: Package });
  }

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavItem
                key={item.id}
                icon={<Icon />}
                label={item.label}
                isActive={currentView === item.id}
                onClick={() => onViewChange(item.id as View)}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`relative flex flex-col items-center justify-center w-16 ${
        isActive 
          ? 'text-indigo-600 dark:text-indigo-400' 
          : 'text-gray-500 dark:text-gray-400'
      }`}
    >
      <div className="relative">
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute -inset-2 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-lg -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        {icon}
      </div>
      <span className="text-xs mt-1 font-medium">{label}</span>
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute -top-1 w-8 h-0.5 bg-indigo-600 dark:bg-indigo-400"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
}