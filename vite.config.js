import { defineConfig, loadEnv } from "vite"; 
import { cwd } from 'node:process'; 
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), "");

  return {
    plugins: [react(), mkcert()],
    server: {
      https: true,
      port: 5050,
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
