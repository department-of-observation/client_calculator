import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(import.meta.dirname), '');
  
  return {
    plugins: [
      react(), 
      tailwindcss(),
      createHtmlPlugin({
        inject: {
          data: {
            VITE_APP_TITLE: env.VITE_APP_TITLE || 'Client Calculator',
            VITE_APP_LOGO: env.VITE_APP_LOGO || '/logo.png',
            VITE_ANALYTICS_ENDPOINT: env.VITE_ANALYTICS_ENDPOINT || '',
            VITE_ANALYTICS_WEBSITE_ID: env.VITE_ANALYTICS_WEBSITE_ID || '',
          },
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
      },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      strictPort: false,
      host: true,
      hmr: {
        clientPort: 443,
        protocol: 'wss'
      },
      allowedHosts: [".manus-asia.computer"]
    },
  };
});

