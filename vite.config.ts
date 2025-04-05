import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  base: '/widgets/widget-excalidraw-2025/',

  plugins: [
    react(),
    visualizer(),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const siyuanLangs = ['ar-SA', 'de-DE', 'en-US', 'es-ES', 'fr-FR', 'he-IL', 'it-IT', 'ja-JP', 'pl-PL', 'ru-RU', 'zh-CHT', 'zh-CN']
          if (id.includes('@excalidraw/excalidraw/dist/prod/locales/') && !siyuanLangs.some(locale => id.includes(locale + '-'))) {
            return 'excalidraw-other-langs'; // всё в один файл
          }
        },
      },
    },
  },
})
