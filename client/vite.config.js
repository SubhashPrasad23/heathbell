// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  optimizeDeps: {
    exclude: [
      '@capacitor/app',
      '@capacitor/local-notifications',
      '@capacitor/background-task'
    ],
  },
  build: {
    rollupOptions: {
      external: [
        '@capacitor/app',
        '@capacitor/local-notifications',
        '@capacitor/background-task'
      ],
    },
  },
});
