import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { getNextBuildNumber } from "./scripts/build-version.js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Gera data e número da compilação
  const now = new Date();
  const buildDate = now.toISOString();
  const buildNumber = process.env.BUILD_NUMBER || getNextBuildNumber();

  return {
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
    },
    define: {
      // Define variáveis de ambiente para a data de compilação
      'import.meta.env.VITE_BUILD_DATE': JSON.stringify(buildDate),
      'import.meta.env.VITE_BUILD_NUMBER': JSON.stringify(buildNumber),
      // Mantém as variáveis existentes se houver
      ...(process.env.VITE_SUPABASE_URL && {
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL)
      }),
      ...(process.env.VITE_SUPABASE_ANON_KEY && {
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
      }),
      ...(process.env.VITE_SUPABASE_SERVICE_ROLE_KEY && {
        'import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY': JSON.stringify(process.env.VITE_SUPABASE_SERVICE_ROLE_KEY)
      })
    }
  };
});
