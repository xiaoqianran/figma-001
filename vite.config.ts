import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(() => {
  const isGitHubPages = process.env.GITHUB_PAGES === 'true' || process.env.CI === 'true';

  return {
    plugins: [react(), tailwindcss()],
    base: isGitHubPages ? '/figma-001/' : '/',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 5173,
      open: true,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'motion': ['framer-motion'],
            'icons': ['lucide-react'],
          },
        },
      },
    },
  };
});