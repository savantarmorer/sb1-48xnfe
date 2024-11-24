/**
 * Navigation view types for the application
 * Used by AppContent and Navigation components
 */
export type View = 
  | 'home' 
  | 'leaderboard' 
  | 'quests' 
  | 'store' 
  | 'profile' 
  | 'inventory' 
  | 'admin'
  | 'battle';  // Add battle view

/**
 * Dependencies:
 * - None (pure type definition)
 * 
 * Used by:
 * - AppContent.tsx
 * - Navigation.tsx
 * - NavigationProps interface
 * 
 * Features:
 * - Type-safe navigation
 * - Centralized view definition
 * - Easy to extend
 * 
 * Related Components:
 * - Navigation
 * - AppContent
 * - All view components
 */

