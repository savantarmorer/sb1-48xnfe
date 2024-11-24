import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { NotificationType } from '../../types/notifications';
import { RewardToast } from './RewardToast';
import { AchievementToast } from './AchievementToast';
import { QuestToast } from './QuestToast';

interface NotificationToastProps {
  notification: NotificationType;
  onDismiss: () => void;
}

export function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getToastContent = () => {
    switch (notification.type) {
      case 'reward':
        return <RewardToast reward={notification.message} />;
      case 'achievement':
        return <AchievementToast achievement={notification.message} />;
      case 'quest':
        return <QuestToast quest={notification.message} />;
      default:
        return (
          <div className="flex items-center">
            {getIcon()}
            <span className="ml-2">{notification.message}</span>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="notification-toast"
    >
      <div className="flex justify-between items-center">
        {getToastContent()}
        <button
          onClick={onDismiss}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
