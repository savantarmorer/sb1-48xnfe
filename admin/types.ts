export interface BaseManagerProps {
  onSave: (data: any, type: string) => Promise<void>;
  onDelete: (id: string, type: string) => Promise<void>;
  loading: boolean;
}

export interface UserManagerProps extends BaseManagerProps {
  // Add user-specific props
}

export interface ItemManagerProps extends BaseManagerProps {
  // Add item-specific props
}

export interface AchievementManagerProps extends BaseManagerProps {
  // Add achievement-specific props
}

export interface QuestManagerProps extends BaseManagerProps {
  // Add quest-specific props
}

export interface ShopManagerProps extends BaseManagerProps {
  // Add shop-specific props
} 

