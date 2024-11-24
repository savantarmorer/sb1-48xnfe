import React from 'react';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-50"
    >
      <div className="text-center">
        <motion.div
          animate={{ 
            rotate: 360,
            transition: {
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          <Loader className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto" />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-gray-600 dark:text-gray-400 font-medium"
        >
          Carregando...
        </motion.p>
      </div>
    </motion.div>
  );
} 

