import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useAdminActions } from '../hooks/useAdminActions';

interface AdminContextType {
  debugActions: {
    resetStreak: () => void;
    addCoins: (amount: number) => void;
    addXP: (amount: number) => void;
    setLevel: (level: number) => void;
  };
  isAdmin: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('admin') || false;
  const { resetStreak, addCoins, addXP, setLevel } = useAdminActions();

  const debugActions = {
    resetStreak: () => {
      if (!isAdmin) return;
      resetStreak();
    },
    addCoins: (amount: number) => {
      if (!isAdmin) return;
      addCoins(amount);
    },
    addXP: (amount: number) => {
      if (!isAdmin) return;
      addXP(amount);
    },
    setLevel: (level: number) => {
      if (!isAdmin) return;
      setLevel(level);
    }
  };

  const value = {
    debugActions,
    isAdmin
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};