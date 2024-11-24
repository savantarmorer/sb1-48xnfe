import { ReactNode } from 'react';
import { Achievement } from './achievements';
import { Quest } from './quests';
import { Reward } from './rewards';

export type NotificationType = 
  | 'success' 
  | 'error' 
  | 'admin' 
  | 'achievement' 
  | 'battle' 
  | 'debug'
  | 'quest'
  | 'reward'
  | 'level_up'
  | 'streak';

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string | ReactNode | Achievement | Quest | Reward;
  duration: number;
  data?: unknown;
  variant?: 'default' | 'persistent' | 'interactive';
  actions?: NotificationAction[];
  icon?: ReactNode;
  color?: string;
}

export interface NotificationState {
  queue: NotificationItem[];
  current: NotificationItem | null;
}

export type NotificationPayload = Omit<NotificationItem, 'id'>; 

