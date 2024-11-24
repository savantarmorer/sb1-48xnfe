import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircle2 as User2Icon,
  ShieldCheck as ShieldIcon,
  Star as StarIcon,
  Camera, 
  Edit2, 
  Save, 
  X as CloseIcon
} from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useAdminActions } from '../../hooks/useAdminActions';
import Button from '../Button';
import type { User } from '../../types';

/**
 * Interface for user profile updates
 * Extends User type to ensure ID is always present
 */
interface UserUpdateData extends Partial<User> {
  id: string;
}

/**
 * Interface for user profile form data
 */
interface UserProfileForm {
  name: string;
  title: string;
  avatar: string;
  roles: string[];
}

/**
 * Interface for component state
 */
interface UserManagerState {
  selectedUser: Partial<User> | null;
  isLoading: boolean;
  isEditing: boolean;
  formData: UserProfileForm;
}

/**
 * UserManager Component
 * Handles user management in the admin dashboard
 */
export default function UserManager(): JSX.Element {
  const { state } = useGame();
  const { updateUserProfile } = useAdminActions();
  
  // Initialize component state
  const [localState, setLocalState] = useState<UserManagerState>({
    selectedUser: null,
    isLoading: false,
    isEditing: false,
    formData: {
      name: '',
      title: '',
      avatar: '',
      roles: []
    }
  });

  /**
   * Handles user profile updates
   * @param updates - User data to update
   */
  const handleUpdateUser = async (updates: UserUpdateData) => {
    if (!updates.id) {
      console.error('User ID is required for updates');
      return;
    }

    try {
      setLocalState(prev => ({ ...prev, isLoading: true }));
      await updateUserProfile(updates.id, updates);
      setLocalState(prev => ({ ...prev, isEditing: false }));
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLocalState(prev => ({ ...prev, isLoading: false }));
    }
  };

  /**
   * Handles role toggle for users
   * @param userId - ID of the user
   * @param role - Role to toggle
   */
  const handleToggleRole = (userId: string, role: string) => {
    const currentRoles = localState.formData.roles;
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];

    setLocalState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        roles: newRoles
      }
    }));

    handleUpdateUser({
      id: userId,
      roles: newRoles
    });
  };

  /**
   * Handles edit mode toggle
   * @param user - User to edit
   */
  const handleEditClick = (user: User) => {
    setLocalState(prev => ({
      ...prev,
      selectedUser: user,
      isEditing: true,
      formData: {
        name: user.name,
        title: user.title || '',
        avatar: user.avatar || '',
        roles: user.roles || []
      }
    }));
  };

  /**
   * Handles form data updates
   * @param updates - Partial form data updates
   */
  const handleFormChange = (updates: Partial<UserProfileForm>) => {
    setLocalState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        ...updates
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* User Profile Section */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <User2Icon className="text-gray-400" size={24} />
            <h3 className="text-lg font-semibold dark:text-white">User Profile</h3>
          </div>
          <Button
            variant="primary"
            onClick={() => handleEditClick(state.user)}
            icon={<Edit2 size={16} />}
            disabled={localState.isLoading}
          >
            Edit Profile
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {localState.isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Edit Form */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={localState.formData.name}
                    onChange={e => handleFormChange({ name: e.target.value })}
                    className="input w-full"
                    disabled={localState.isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={localState.formData.title}
                    onChange={e => handleFormChange({ title: e.target.value })}
                    className="input w-full"
                    disabled={localState.isLoading}
                  />
                </div>
              </div>

              {/* Role Management */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ShieldIcon className="text-gray-400" size={16} />
                  <label className="block text-sm font-medium mb-1">Roles</label>
                </div>
                <div className="flex space-x-2">
                  {['admin', 'moderator', 'premium'].map(role => (
                    <Button
                      key={role}
                      variant={localState.formData.roles.includes(role) ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleRole(state.user.id, role)}
                      disabled={localState.isLoading}
                      icon={role === 'premium' ? <StarIcon size={14} /> : <ShieldIcon size={14} />}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setLocalState(prev => ({ ...prev, isEditing: false }))}
                  disabled={localState.isLoading}
                  icon={<CloseIcon size={16} />}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleUpdateUser({
                    id: state.user.id,
                    ...localState.formData
                  })}
                  icon={<Save size={16} />}
                  disabled={localState.isLoading}
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
              className="space-y-4"
            >
              {/* User Info Display */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={state.user.avatar || '/default-avatar.png'}
                    alt={state.user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {localState.isEditing && (
                    <button className="absolute bottom-0 right-0 p-1 bg-indigo-600 rounded-full">
                      <Camera size={16} className="text-white" />
                    </button>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold dark:text-white">{state.user.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{state.user.title}</p>
                </div>
              </div>

              {/* Role Badges */}
              <div className="flex flex-wrap gap-2">
                {state.user.roles?.map(role => (
                  <span
                    key={role}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      role === 'admin'
                        ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                    }`}
                  >
                    {role === 'admin' ? (
                      <ShieldIcon size={12} className="mr-1" />
                    ) : role === 'premium' ? (
                      <StarIcon size={12} className="mr-1" />
                    ) : null}
                    {role}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Component Dependencies:
 * - Lucide icons for UI elements
 * - useGame for state management
 * - useAdminActions for user operations
 * - Button component for interactions
 * - Framer Motion for animations
 * 
 * Icon Usage:
 * - User2Icon: Main profile icon
 * - ShieldIcon: Admin/moderator role indicator
 * - StarIcon: Premium role indicator
 * - Camera: Avatar upload indicator
 * - Edit2: Edit mode toggle
 * - Save: Save changes action
 * - CloseIcon: Cancel/close actions
 */