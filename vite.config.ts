import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  root: path.resolve(__dirname, 'src/front-end'),
  build: {
    outDir: path.resolve(__dirname, 'dist'), // Pasta de saída (opcional)
  },  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/front-end"),
    },
  },
}));
