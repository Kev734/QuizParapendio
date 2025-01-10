import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configurazione per GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/QuizParapendio/', // Nome del repository
  build: {
    outDir: 'dist',
  },
});
