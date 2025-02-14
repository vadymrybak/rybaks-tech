import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true,
        headers: {
          "x-auth-request-access-token": "dummy",
        },
      },
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true,
        headers: {
          "x-auth-request-access-token": "dummy",
        },
      },
      "/user": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true,
        headers: {
          "x-auth-request-access-token": "dummy",
        },
      },
    },
  },
});
