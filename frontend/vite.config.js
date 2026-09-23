import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (command === "serve" && mode !== "test" && !env.DEV_API_UPSTREAM) {
    throw new Error("DEV_API_UPSTREAM is required to start the Vite development server.");
  }

  return {
    plugins: [vue()],
    server: env.DEV_API_UPSTREAM ? {
      proxy: {
        "/api": {
          target: env.DEV_API_UPSTREAM,
          changeOrigin: true,
        },
      },
    } : undefined,
    test: {
      environment: "jsdom",
    },
  };
});
