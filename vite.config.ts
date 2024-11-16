import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
          game: ['./src/contexts/GameContext.tsx', './src/lib/levelSystem.ts'],
          ui: ['./src/components/RewardSystem', './src/components/Store.tsx']
        }
      }
    }
  }
});