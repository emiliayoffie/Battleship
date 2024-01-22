import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // alias: {
    //   "@/components": resolve(__dirname, "./src/components/"),
    //   "@/types": resolve(__dirname, "./src/types/"),
    //   "@/utils": resolve(__dirname, "./src/utils/"),
    // },
  },
});