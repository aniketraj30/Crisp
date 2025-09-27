import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://aniketraj30.github.io/Crisp/', // Replace 'Crisp' with your repository name
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
