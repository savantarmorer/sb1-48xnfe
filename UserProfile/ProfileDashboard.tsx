import React from 'react';
import { motion } from 'framer-motion';
import { Book, Clock, Target, Award, TrendingUp, Star, LogOut } from 'lucide-react';
import { useGame } from '../../contexts/gameContext';
import { useAuth } from '../../contexts/authContext';
import { LevelSystem } from '../../lib/levelSystem';
import Button from '../Button';

export default function ProfileDashboard() {
  const { state } = useGame();
  const { signOut } = useAuth();
  const totalStudyTime = state.user.studyTime || 0;
  const studyHours = Math.floor(totalStudyTime / 60);
  const questCompletion = state.quests?.length 
    ? ((state.completedQuests?.length || 0) / state.quests.length) * 100 
    : 0;
  const achievementProgress = state.achievements?.length 
    ? ((state.achievements.filter(a => a.unlocked)?.length || 0) / state.achievements.length) * 100 
    : 0;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logout Button */}
      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={handleLogout}
          icon={<LogOut size={18} />}
          className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        >
          Logout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: 'Study Hours',
            value: studyHours.toString(),
            icon: <Clock className="text-blue-500" />,
            change: `+${Math.floor(studyHours * 0.1)}%`
          },
          {
            label: 'Quest Progress',
            value: `${Math.floor(questCompletion)}%`,
            icon: <Target className="text-green-500" />,
            change: `+${Math.floor(questCompletion * 0.08)}%`
          },
          {
            label: 'Achievements',
            value: `${state.achievements?.filter(a => a.unlocked)?.length || 0}/${state.achievements?.length || 0}`,
            icon: <Award className="text-purple-500" />,
            change: `+${Math.floor(achievementProgress)}%`
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              {stat.icon}
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-sm text-green-500">{stat.change} from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Learning Progress */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Book className="text-indigo-500" />
          <span>Learning Progress</span>
        </h3>
        <div className="space-y-4">
          {[
            { subject: 'Constitutional Law', score: state.user.constitutionalScore },
            { subject: 'Civil Law', score: state.user.civilScore },
            { subject: 'Criminal Law', score: state.user.criminalScore },
            { subject: 'Administrative Law', score: state.user.administrativeScore }
          ].map((subject) => (
            <div key={subject.subject}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{subject.subject}</span>
                <span className="text-sm text-muted">{Math.floor((subject.score || 0) / 10)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.floor((subject.score || 0) / 10)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Star className="text-yellow-500" />
          <span>Recent Achievements</span>
        </h3>
        <div className="space-y-3">
          {state.achievements?.filter(a => a.unlocked)?.slice(-3).map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <Award className={`text-${achievement.rarity === 'legendary' ? 'yellow' : 'indigo'}-500`} />
              <div>
                <h4 className="font-medium">{achievement.title}</h4>
                <p className="text-sm text-muted">{achievement.description}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                  Unlocked {new Date(achievement.unlockedAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}