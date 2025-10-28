import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const SERVER = "http://127.0.0.1:8000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: SERVER,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
