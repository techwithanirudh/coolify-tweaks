import { defineConfig } from 'vite';
import banner from 'vite-plugin-banner';
import path from 'path';
import pkg from './package.json';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.scss'),
      output: {
        assetFileNames: '[name].user.css',
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, 'src')],
      },
    },
  },
  plugins: [
    banner(`/* ==UserStyle==
@name ${pkg.name}
@version ${pkg.version}
@namespace ${pkg.author}
@updateURL https://github.com/techwithanirudh/coolify-tweaks/raw/main/dist/main.user.css
@description ${pkg.description}
@license ${pkg.license}
==/UserStyle== */`),
  ],
});
