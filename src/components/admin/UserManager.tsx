import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { User2, Shield, Star, Award, Camera, Edit2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditProfileProps {
  onClose: () => void;
  onSave: (data: { name: string; title: string; avatar: string }) => void;
  initialData: {
    name: string;
    title: string;
    avatar: string;
  };
}

function EditProfileModal({ onClose, onSave, initialData }: EditProfileProps) {
  const [formData, setFormData] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(initialData.avatar);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, avatar: base64String }));
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
      >
        <h3 className="text-xl font-bold mb-4 dark:text-white">Editar Perfil</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <label className="absolute bottom-0 right-0 p-1 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                <Camera size={16} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="input w-full"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function UserManager() {
  const { state, dispatch } = useGame();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleUpdateProfile = (data: { name: string; title: string; avatar: string }) => {
    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: data
    });
  };

  const handleToggleRole = (userId: string, role: string) => {
    const user = state.user;
    const currentRoles = user.roles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];

    dispatch({
      type: 'SET_USER_ROLE',
      payload: newRoles
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold dark:text-white">User Profile</h3>
          <button
            onClick={() => setShowEditProfile(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <img
            src={state.user.avatar}
            alt={state.user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold dark:text-white">{state.user.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{state.user.title}</p>
            <div className="flex items-center space-x-2 mt-2">
              {state.user.roles?.map(role => (
                <span
                  key={role}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    role === 'admin'
                      ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                  }`}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="text-indigo-500" size={20} />
              <span className="font-medium dark:text-white">Admin Access</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={state.user.roles?.includes('admin') || false}
                onChange={() => handleToggleRole(state.user.id, 'admin')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
            <div className="flex items-center space-x-3">
              <Star className="text-yellow-500" size={20} />
              <span className="font-medium dark:text-white">Premium Status</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={state.user.roles?.includes('premium') || false}
                onChange={() => handleToggleRole(state.user.id, 'premium')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEditProfile && (
          <EditProfileModal
            onClose={() => setShowEditProfile(false)}
            onSave={handleUpdateProfile}
            initialData={{
              name: state.user.name,
              title: state.user.title || '',
              avatar: state.user.avatar || ''
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}