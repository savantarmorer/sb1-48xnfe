import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotification } from '../../contexts/NotificationContext';
import { NotificationToast } from './NotificationToast';

export function NotificationContainer() {
  const { state, dismissNotification } = useNotification();

  return (
    <AnimatePresence mode="wait">
      {state.current && (
        <NotificationToast
          key={state.current.id}
          notification={state.current}
          onDismiss={() => dismissNotification(state.current?.id)}
        />
      )}
    </AnimatePresence>
  );
}

/**
 * Dependencies:
 * - framer-motion for animations
 * - NotificationContext for state
 * - NotificationToast for rendering
 * 
 * Used by:
 * - App.tsx
 * 
 * Features:
 * - Animated notifications
 * - Queue management
 * - Proper cleanup
 */ 

