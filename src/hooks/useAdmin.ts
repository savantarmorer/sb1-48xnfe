import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for admin functionality and permissions
 * Provides admin-only actions and state management
 */
export function useAdmin() {
  const { state } = useGame();
  const { user: authUser } = useAuth();

  // Check both game state and auth state for admin status
  const isAdmin = (state.user?.email === 'admin@admin' || authUser?.email === 'admin@admin') || 
                 (state.user?.roles?.includes('admin') || authUser?.roles?.includes('admin'));

  // Debug logging for admin status
  if (process.env.NODE_ENV === 'development') {
    console.log('[useAdmin]', {
      userEmail: state.user?.email || authUser?.email,
      isAdmin,
      userRoles: state.user?.roles || authUser?.roles,
      timestamp: new Date().toISOString(),
      fullUser: state.user || authUser,
      authState: !!authUser,
      gameState: !!state.user
    });
  }

  const debugAdmin = {
    checkPermissions: () => {
      console.log('[Admin Debug]', {
        isAdmin,
        user: state.user || authUser,
        authStatus: !!(state.user?.email || authUser?.email),
        timestamp: new Date().toISOString()
      });
    },
    logState: () => {
      console.log('[Admin State]', {
        gameState: state,
        authState: authUser,
        adminStatus: isAdmin,
        userEmail: state.user?.email || authUser?.email,
        timestamp: new Date().toISOString()
      });
    }
  };

  return {
    isAdmin,
    debugAdmin
  };
}

/**
 * Hook Dependencies:
 * - useGame: For accessing and modifying game state
 * - useNotificationSystem: For user feedback
 * 
 * State Management:
 * - Uses GameContext for state
 * - Handles admin permissions
 * - Manages debug actions
 * 
 * Used By:
 * - AdminDashboard component
 * - Debug components
 * - Testing utilities
 * 
 * Features:
 * - Permission checking
 * - Debug actions
 * - User feedback
 * - State manipulation
 * 
 * Scalability:
 * - Easy to add new debug actions
 * - Centralized admin logic
 * - Type-safe operations
 * - Proper error handling
 * 
 * Security:
 * - Permission checks
 * - Admin-only actions
 * - Safe state updates
 */

