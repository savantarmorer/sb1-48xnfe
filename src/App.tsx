import React from 'react';
import { GavelIcon } from 'lucide-react';
import { GameProvider } from './contexts/GameContext';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import UserProgress from './components/UserProgress';
import DailyChallenges from './components/DailyChallenges';
import BattleMode from './components/BattleMode';
import { XPSystem } from './components/RewardSystem/XPSystem';
import { LevelSystem } from './components/RewardSystem/LevelSystem';
import { Achievements } from './components/RewardSystem/Achievements';
import { PremiumRewards } from './components/RewardSystem/PremiumRewards';
import Leaderboard from './components/Leaderboard';
import QuestSystem from './components/QuestSystem';
import Store from './components/Store';
import AuthForm from './components/Auth/AuthForm';

export default function App() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [currentView, setCurrentView] = React.useState<'home' | 'leaderboard' | 'quests' | 'store' | 'profile'>('home');
  const [isBattleMode, setIsBattleMode] = React.useState(false);

  if (!user) {
    return <AuthForm />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'leaderboard':
        return <Leaderboard />;
      case 'quests':
        return <QuestSystem />;
      case 'store':
        return <Store />;
      case 'profile':
        return (
          <>
            <UserProgress showSettings />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <LevelSystem />
              <Achievements />
            </div>
            <PremiumRewards />
          </>
        );
      default:
        return (
          <>
            <UserProgress />
            <DailyChallenges />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <XPSystem />
              <Achievements />
            </div>
            <PremiumRewards />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-gradient-to-r from-brand-teal-600 to-brand-teal-700 dark:from-brand-teal-800 dark:to-brand-teal-900 text-white py-4 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GavelIcon size={32} className="text-brand-teal-200" />
            <h1 className="text-2xl font-bold">CepaC Play</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsBattleMode(true)}
              className="bg-brand-teal-500 hover:bg-brand-teal-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {t('battle.quickBattle')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {renderView()}
      </main>

      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {isBattleMode && <BattleMode onClose={() => setIsBattleMode(false)} />}
    </div>
  );
}