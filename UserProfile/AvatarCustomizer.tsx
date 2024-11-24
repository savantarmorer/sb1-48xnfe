import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Check, Image as ImageIcon } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import Button from '../Button';

const AVATAR_FRAMES = [
  { id: 'default', name: 'Default', borderColor: 'border-gray-200' },
  { id: 'gold', name: 'Gold', borderColor: 'border-yellow-400' },
  { id: 'diamond', name: 'Diamond', borderColor: 'border-blue-400' },
  { id: 'premium', name: 'Premium', borderColor: 'border-purple-400' }
];

export default function AvatarCustomizer() {
  const { state, dispatch } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState('default');
  const [previewImage, setPreviewImage] = useState(state.user.avatar);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveChanges = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulating API call
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: {
          avatar: previewImage,
          avatarFrame: selectedFrame
        }
      });
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Avatar Customization</h3>
        {!isEditing && (
          <Button
            variant="primary"
            onClick={() => setIsEditing(true)}
            icon={<Camera size={18} />}
          >
            Customize
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Avatar preview"
                  className={`w-32 h-32 rounded-full object-cover border-4 ${AVATAR_FRAMES.find(f => f.id === selectedFrame)?.borderColor}`}
                />
                <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                  <Camera size={20} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Avatar Frames</h4>
              <div className="grid grid-cols-2 gap-3">
                {AVATAR_FRAMES.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame.id)}
                    className={`p-3 rounded-lg border ${
                      selectedFrame === frame.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    } flex items-center space-x-2`}
                  >
                    <div className={`w-8 h-8 rounded-full ${frame.borderColor} border-2`} />
                    <span className="font-medium">{frame.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
                icon={<X size={18} />}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={saveChanges}
                icon={<Check size={18} />}
                loading={isLoading}
              >
                Save Changes
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-4"
          >
            <img
              src={state.user.avatar}
              alt={state.user.name}
              className={`w-24 h-24 rounded-full object-cover border-4 ${
                AVATAR_FRAMES.find(f => f.id === state.user.avatarFrame)?.borderColor || AVATAR_FRAMES[0].borderColor
              }`}
            />
            <div>
              <h4 className="font-medium">{state.user.name}</h4>
              <p className="text-sm text-muted">
                {AVATAR_FRAMES.find(f => f.id === state.user.avatarFrame)?.name || 'Default'} Frame
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}