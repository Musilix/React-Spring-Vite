// import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // for legacy support + polyfills
    // legacy({
    //   targets: ["defaults", "not IE 11"],
    // }),
  ],
});
