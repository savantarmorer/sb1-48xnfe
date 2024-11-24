import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { NotificationItem } from '../types/notifications';

interface NotificationState {
  queue: NotificationItem[];
  current: NotificationItem | null;
}

interface NotificationContextType {
  state: NotificationState;
  showNotification: (notification: Omit<NotificationItem, 'id'>) => void;
  dismissNotification: (id?: string) => void;
  clearNotifications: () => void;
  updateNotification: (id: string, updates: Partial<NotificationItem>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type NotificationAction =
  | { type: 'SHOW_NOTIFICATION'; payload: NotificationItem }
  | { type: 'DISMISS_NOTIFICATION'; payload?: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; updates: Partial<NotificationItem> } };

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SHOW_NOTIFICATION': {
      const newQueue = [...state.queue, action.payload];
      return {
        ...state,
        queue: newQueue,
        current: state.current || action.payload
      };
    }
    case 'DISMISS_NOTIFICATION': {
      if (action.payload) {
        const newQueue = state.queue.filter(n => n.id !== action.payload);
        return {
          ...state,
          queue: newQueue,
          current: state.current?.id === action.payload ? newQueue[0] || null : state.current
        };
      }
      const newQueue = state.queue.slice(1);
      return {
        ...state,
        queue: newQueue,
        current: newQueue[0] || null
      };
    }
    case 'UPDATE_NOTIFICATION': {
      const { id, updates } = action.payload;
      const newQueue = state.queue.map(notification =>
        notification.id === id ? { ...notification, ...updates } : notification
      );
      return {
        ...state,
        queue: newQueue,
        current: state.current?.id === id 
          ? { ...state.current, ...updates }
          : state.current
      };
    }
    case 'CLEAR_NOTIFICATIONS':
      return { queue: [], current: null };
    default:
      return state;
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, {
    queue: [],
    current: null
  });

  const showNotification = useCallback((notification: Omit<NotificationItem, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    dispatch({
      type: 'SHOW_NOTIFICATION',
      payload: { ...notification, id }
    });
  }, []);

  const dismissNotification = useCallback((id?: string) => {
    dispatch({ type: 'DISMISS_NOTIFICATION', payload: id });
  }, []);

  const updateNotification = useCallback((id: string, updates: Partial<NotificationItem>) => {
    dispatch({ type: 'UPDATE_NOTIFICATION', payload: { id, updates } });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, []);

  return (
    <NotificationContext.Provider 
      value={{ 
        state, 
        showNotification, 
        dismissNotification, 
        clearNotifications,
        updateNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
} 

