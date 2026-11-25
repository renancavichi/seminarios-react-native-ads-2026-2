import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // permite abrir o build em qualquer subpasta (GitHub Pages etc.)
  server: { port: 5173 },
  build: { chunkSizeWarningLimit: 2000 }, // maplibre-gl sozinho tem ~1 MB
});
