import { defineConfig } from 'vite';
import banner from 'vite-plugin-banner';
import path from 'path';
import pkg from './package.json';
import { fixImportsInMozDocument } from './plugins/vite/userstyle-processor';

export default defineConfig({
  server: {
    host: true,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      input: path.resolve(__dirname, pkg.main),
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
@namespace ${pkg.author.url}
@author ${pkg.author.name} <${pkg.author.email}> (${pkg.author.url})
@homepageURL ${pkg.homepage}
@updateURL https://coolify-tweaks-api.techwithanirudh.com/release/latest/?asset=main.user.css
@description ${pkg.description}
@license ${pkg.license}
==/UserStyle== */`),
    fixImportsInMozDocument(),
  ],
});
