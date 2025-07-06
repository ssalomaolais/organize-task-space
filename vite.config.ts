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
    //sourcemap: mode === 'development' ? 'inline' : false, // 👈 Gera source maps em dev
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/front-end"),
      "@/*": path.resolve(__dirname, "src/front-end/*") // 👈 Adicione esta linha
    },
  },/*
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
    'import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY': JSON.stringify(process.env.VITE_SUPABASE_SERVICE_ROLE_KEY)
  }*/
}));
