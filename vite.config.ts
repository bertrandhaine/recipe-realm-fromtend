import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path";
import Components from "unplugin-vue-components/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (!env.VITE_BASE_API_URL) {
    throw new Error(
      "The env variable VITE_BASE_API_URL is missing from the .env file. Please copy paste the content of the .env.example and set your own variables.",
    );
  }

  return {
    plugins: [vue(), Components()],
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
