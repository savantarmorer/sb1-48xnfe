import { Achievement } from './achievements';
import { Quest } from './quests';
import { GameItem } from './items';
import { User } from './user';

export interface BaseManagerProps {
  onSave: (data: any, type: string) => Promise<void>;
  onDelete: (id: string, type: string) => Promise<void>;
  loading: boolean;
}

export interface UserManagerProps extends BaseManagerProps {
  users: User[];
  onUpdateUser: (user: User) => Promise<void>;
}

export interface ItemManagerProps extends BaseManagerProps {
  items: GameItem[];
  onUpdateItem: (item: GameItem) => Promise<void>;
}

export interface AchievementManagerProps extends BaseManagerProps {
  achievements: Achievement[];
  onUpdateAchievement: (achievement: Achievement) => Promise<void>;
}

export interface QuestManagerProps extends BaseManagerProps {
  quests: Quest[];
  onUpdateQuest: (quest: Quest) => Promise<void>;
}

export interface ShopManagerProps extends BaseManagerProps {
  items: GameItem[];
  onUpdateShopItem: (item: GameItem) => Promise<void>;
} 

