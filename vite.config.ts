import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    // dts({
    //   insertTypesEntry: true,
    // }),
  ],
  build: {
    lib: {
      entry: "./src/components/index.ts",
      name: "MyLib",
      formats: ["es"],
      fileName: (format: string) => `components.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
