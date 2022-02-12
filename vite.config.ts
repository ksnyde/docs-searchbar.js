/// <reference types="vitest" />

import path from "node:path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import WindiCSS from "vite-plugin-windicss";
import Inspect from "vite-plugin-inspect";
import dts from "vite-plugin-dts";

export default defineConfig({
  server: {
    proxy: {
      "/local": {
        target: "http://localhost:7700",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/local/, "/"),
      },
      "/staging": {
        target: "https://search2.tauri.studio",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/staging/, "/"),
      },
      "/production": {
        target: "https://search.tauri.studio",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/production/, "/"),
      },
    },
  },
  resolve: {
    dedupe: ["vue"],
    alias: {
      "~": `${path.resolve(process.cwd(), "src")}`,
    },
  },
  build: {
    lib: {
      name: "meili-searchbar",
      entry: path.resolve(process.cwd(), "src/components/index"),
      formats: ["es"],
    },
    minify: "esbuild",
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },

  plugins: [
    Vue(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ["vue", "@vueuse/core", "vitest"],
      dts: "src/auto-imports.d.ts",
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ["vue"],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/],

      // custom resolvers
      resolvers: [
        // auto import icons
        // https://github.com/antfu/unplugin-icons
        IconsResolver({
          componentPrefix: "",
        }),
      ],

      dts: "src/components.d.ts",
    }),

    // https://github.com/antfu/unplugin-icons
    Icons({
      autoInstall: true,
    }),

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS(),

    // https://github.com/antfu/vite-plugin-inspect
    Inspect({
      // change this to enable inspect for debugging
      enabled: false,
    }),
    dts(),
  ],

  optimizeDeps: {
    include: ["vue", "@vueuse/core"],
    exclude: ["vue-demi"],
  },

  // https://github.com/vitest-dev/vitest
  test: {
    include: ["test/**/*.test.ts"],
    environment: "jsdom",
    api: {
      port: 4444,
      host: "0.0.0.0",
    },
    deps: {
      inline: ["@vue", "@vueuse", "vue-demi"],
    },
  },
});
