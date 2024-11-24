import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Gift, Star } from 'lucide-react';
import Particles from 'react-particles';
import type { Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';
import Button from '../Button';
import type { ISourceOptions } from 'tsparticles-engine';

/**
 * Props interface for RewardNotification component
 */
interface RewardNotificationProps {
  reward: {
    type: 'xp' | 'coins' | 'item';
    value: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  onClaim: () => void;
}

/**
 * Particle configuration interface
 */
interface ParticleConfig extends ISourceOptions {
  particles: {
    number: {
      value: number;
      density: {
        enable: boolean;
        value_area: number;
      };
    };
    color: {
      value: string;
    };
    shape: {
      type: string;
    };
    opacity: {
      value: number;
      random: boolean;
    };
    size: {
      value: number;
      random: boolean;
    };
    move: {
      enable: boolean;
      speed: number;
      direction: MoveDirection;
      random: boolean;
      straight: boolean;
      out_mode: OutMode;
      bounce: boolean;
    };
  };
}

/**
 * Enum for particle movement directions
 */
type MoveDirection = 'none' | 'top' | 'top-right' | 'right' | 'bottom-right' | 
                    'bottom' | 'bottom-left' | 'left' | 'top-left';

/**
 * Enum for particle out mode
 */
type OutMode = 'out' | 'destroy' | 'bounce' | 'none';

/**
 * RewardNotification Component
 * Displays animated reward notifications with particle effects
 */
export default function RewardNotification({ reward, onClaim }: RewardNotificationProps) {
  /**
   * Initializes particle system
   * @param engine - TSParticles engine instance
   */
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  /**
   * Generates particle configuration based on reward rarity
   * @param rarity - Reward rarity level
   * @returns Particle system configuration
   */
  const getParticlesConfig = (rarity: string): ParticleConfig => {
    const color = rarity === 'legendary' ? '#FFD700' :
                 rarity === 'epic' ? '#A855F7' :
                 rarity === 'rare' ? '#3B82F6' :
                 '#9CA3AF';

    return {
      particles: {
        number: {
          value: rarity === 'legendary' ? 100 : 50,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: color
        },
        shape: {
          type: "star"
        },
        opacity: {
          value: 0.5,
          random: true
        },
        size: {
          value: 3,
          random: true
        },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      }
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      {reward.rarity === 'legendary' && (
        <Particles
          id="reward-particles"
          init={particlesInit}
          options={getParticlesConfig(reward.rarity) as ISourceOptions}
          className="absolute inset-0"
        />
      )}
      
      {/* Reward Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-4 ${
          reward.rarity === 'legendary' ? 'border-2 border-yellow-400' :
          reward.rarity === 'epic' ? 'border-2 border-purple-400' :
          ''
        }`}
      >
        {/* Animated Icon */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="flex justify-center mb-6"
        >
          <div className={`p-4 rounded-full ${
            reward.rarity === 'legendary' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
            reward.rarity === 'epic' ? 'bg-purple-100 dark:bg-purple-900/30' :
            reward.rarity === 'rare' ? 'bg-blue-100 dark:bg-blue-900/30' :
            'bg-gray-100 dark:bg-gray-900/30'
          }`}>
            <Gift size={48} className={
              reward.rarity === 'legendary' ? 'text-yellow-500' :
              reward.rarity === 'epic' ? 'text-purple-500' :
              reward.rarity === 'rare' ? 'text-blue-500' :
              'text-gray-500'
            } />
          </div>
        </motion.div>

        {/* Reward Content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Daily Reward!</h2>
          <div className="flex items-center justify-center space-x-2">
            <Star className={
              reward.rarity === 'legendary' ? 'text-yellow-500' :
              reward.rarity === 'epic' ? 'text-purple-500' :
              reward.rarity === 'rare' ? 'text-blue-500' :
              'text-gray-500'
            } />
            <p className="text-lg font-medium dark:text-gray-200">
              {reward.value} {reward.type.toUpperCase()}
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 capitalize">
            {reward.rarity} Reward
          </p>
        </div>

        {/* Claim Button */}
        <Button
          variant="primary"
          onClick={onClaim}
          className="w-full"
        >
          Claim Reward
        </Button>
      </motion.div>
    </motion.div>
  );
}

/**
 * Component Dependencies:
 * - tsparticles: For particle effects
 * - framer-motion: For animations
 * - Button: For UI interactions
 * 
 * State Management:
 * - No local state, purely presentational
 * 
 * Props:
 * - reward: Reward data (type, value, rarity)
 * - onClaim: Callback for claiming reward
 * 
 * Used By:
 * - DailyRewardSystem component
 * - LootBox component
 * 
 * Features:
 * - Animated reward presentation
 * - Particle effects for legendary rewards
 * - Rarity-based styling
 * 
 * Scalability Considerations:
 * - Typed particle configurations
 * - Modular reward display
 * - Reusable animations
 * - Theme-aware styling
 */