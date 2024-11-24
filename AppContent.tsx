import React, { useState } from 'react';
import Navigation from './Navigation';
import UserProgress from './UserProgress';
import QuestSystem from './QuestSystem';
import Leaderboard from './Leaderboard';
import Store from './Store';
import { useGame } from '../contexts/gameContext';
import { useAuth } from '../contexts/authContext';
import { Achievements } from './RewardSystem/Achievements';
import DailyRewardSystem from './DailyRewards/DailyRewardSystem';
import ProfileDashboard from './UserProfile/ProfileDashboard';
import Inventory from './UserProfile/Inventory';
import { BattleMode } from './Battle';
import AdminDashboard from './admin/AdminDashboard';
import { View } from '../types/navigation';

export default function AppContent() {
  const [currentView, setCurrentView] = useState<View>('home');
  const { state } = useGame();
  const { user: authUser } = useAuth();
  
  // Check both game state and auth state for admin status
  const isAdmin = (state.user?.roles?.includes('admin') || authUser?.roles?.includes('admin')) ||
                 (state.user?.email === 'admin@admin' || authUser?.email === 'admin@admin');

  // Show loading state
  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your game...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-lg text-red-600 mb-2">Error Loading Game</p>
          <p className="text-sm text-red-500">{state.error.message}</p>
          {state.error.details && (
            <p className="text-xs text-red-400 mt-1">{state.error.details}</p>
          )}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-6">
            <DailyRewardSystem />
            <QuestSystem />
          </div>
        );
      case 'leaderboard':
        return <Leaderboard />;
      case 'quests':
        return <QuestSystem />;
      case 'store':
        return <Store />;
      case 'profile':
        return <ProfileDashboard />;
      case 'inventory':
        return <Inventory />;
      case 'admin':
        return isAdmin ? <AdminDashboard onClose={() => setCurrentView('home')} /> : null;
      case 'battle':
        return <BattleMode onClose={() => setCurrentView('home')} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* Header - Always show UserProgress */}
      <header className="app-header">
        <div className="content-container">
          <UserProgress showSettings={currentView === 'home'} />
        </div>
      </header>

      {/* Main Content */}
      <main className="app-content">
        <div className="content-container">
          {renderContent()}
        </div>
      </main>

      {/* Navigation */}
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        showInventory={state.user.roles?.includes('premium')}
        isAdmin={isAdmin}
      />
    </div>
  );
}