import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Bell, Globe, Camera, User, Save } from 'lucide-react';
import { useGame } from '../contexts/gameContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import ThemeToggle from './ThemeToggle';
import Modal from './Modal';
import { useNotification } from '../contexts/NotificationContext';

interface UserSettingsProps {
  onClose: () => void;
}

export default function UserSettings({ onClose }: UserSettingsProps) {
  const { state, dispatch } = useGame();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    full_name: state.user?.full_name || '',
    title: state.user?.title || '',
    avatar: state.user?.avatar_url ?? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  });
  const [settings, setSettings] = useState({
    sound: true,
    notifications: true
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!state.user?.id) {
        throw new Error('User ID not found');
      }

      // Update users table
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          avatar_url: formData.avatar
        })
        .eq('id', state.user.id);

      if (userError) throw userError;

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          title: formData.title
        })
        .eq('id', state.user.id);

      if (profileError) throw profileError;

      // Update local state
      dispatch({
        type: 'UPDATE_USER_PROFILE',
        payload: {
          ...state.user,
          full_name: formData.full_name,
          title: formData.title,
          avatar_url: formData.avatar
        }
      });

      showNotification({
        type: 'success',
        message: 'Profile updated successfully',
        duration: 3000,
        variant: 'default'
      });

      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      showNotification({
        type: 'error',
        message: errorMessage,
        duration: 5000,
        variant: 'default'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      if (!state.user?.id) {
        throw new Error('User ID not found');
      }

      // Check file size (2MB limit)
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        showNotification({
          title: 'Error',
          message: 'File size exceeds the limit of 2MB',
          type: 'error',
          duration: 5000,
          variant: 'default'
        });
        return;
      }

      // Check file type
      const fileType = file.type.toLowerCase();
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(fileType)) {
        showNotification({
          title: 'Error',
          message: 'Only image files (jpg, jpeg, png, gif) are allowed',
          type: 'error',
          duration: 5000,
          variant: 'default'
        });
        return;
      }

      // Create a unique filename using user ID and timestamp
      const fileExt = fileType.split('/')[1];
      const fileName = `${state.user.id}/${Date.now()}.${fileExt}`;

      // Show loading notification
      showNotification({
        title: 'Uploading',
        message: 'Uploading your avatar...',
        type: 'info',
        duration: 3000,
        variant: 'default'
      });

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', state.user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setFormData(prev => ({
        ...prev,
        avatar: publicUrl
      }));

      // Dispatch update to game context
      dispatch({
        type: 'UPDATE_USER_PROFILE',
        payload: {
          ...state.user,
          avatar_url: publicUrl
        }
      });

      showNotification({
        type: 'success',
        message: 'Avatar updated successfully',
        duration: 3000,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar';
      showNotification({
        type: 'error',
        message: errorMessage,
        duration: 5000,
        variant: 'default'
      });
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={t('settings.title')}
    >
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={formData.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                <Camera size={16} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleAvatarUpload(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('settings.fullName')}
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('settings.title')}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Settings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="text-gray-600 dark:text-gray-400" />
              <span className="font-medium dark:text-white">{t('settings.sound')}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sound}
                onChange={e => setSettings(prev => ({ ...prev, sound: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="text-gray-600 dark:text-gray-400" />
              <span className="font-medium dark:text-white">{t('settings.notifications')}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={e => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="text-gray-600 dark:text-gray-400" />
              <span className="font-medium dark:text-white">{t('settings.language')}</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-gray-600 dark:text-gray-400">
                {theme === 'dark' ? '🌙' : '☀️'}
              </div>
              <span className="font-medium dark:text-white">{t('settings.theme')}</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <Save size={16} className="mr-2" />
            )}
            {t('common.save')}
          </button>
        </div>
      </div>
    </Modal>
  );
}