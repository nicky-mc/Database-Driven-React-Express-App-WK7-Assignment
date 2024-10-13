import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 3000, // Adjust the chunk size warning limit to 3000 kB
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      Client: path.resolve(__dirname, "./Client"),
    },
  },
  base: "./", // This ensures that asset URLs are relative
});
