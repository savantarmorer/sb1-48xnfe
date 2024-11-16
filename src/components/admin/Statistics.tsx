import React from 'react';
import { BarChart, Users, Award, TrendingUp } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

export default function Statistics() {
  const { state } = useGame();

  const stats = [
    {
      label: 'Active Users',
      value: '1,234',
      change: '+12%',
      icon: Users,
      trend: 'up'
    },
    {
      label: 'Quests Completed',
      value: '5,678',
      change: '+8%',
      icon: Award,
      trend: 'up'
    },
    {
      label: 'Items Purchased',
      value: '892',
      change: '+15%',
      icon: TrendingUp,
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1 dark:text-white">{stat.value}</h3>
              </div>
              <stat.icon className="text-indigo-500" size={24} />
            </div>
            <div className="mt-4">
              <span className={`text-sm ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
        <div className="space-y-4">
          {state.recentXPGains.map((gain, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-600 rounded-lg"
            >
              <div>
                <p className="font-medium dark:text-white">{gain.reason}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(gain.timestamp).toLocaleString()}
                </p>
              </div>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                +{gain.amount} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}