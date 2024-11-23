import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import liveReload from 'vite-plugin-live-reload';
import viteImagemin from 'vite-plugin-imagemin';

// HTMLファイルを動的に収集
const htmlFiles = fs.readdirSync(path.resolve(__dirname, 'src')).filter(file => file.endsWith('.html'));
const input = htmlFiles.reduce((entries, file) => {
  const name = path.parse(file).name;
  entries[name] = path.resolve(__dirname, `src/${file}`);
  return entries;
}, {});

export default defineConfig({
  root: 'src', // 開発用のルート
  base: '/', // 必要に応じてMAMPのルートに対応
  // server: {
  //   host: 'localhost',
  //   port: 8080, // MAMPのデフォルトポートに合わせる
  //   strictPort: true, // このポートが使用できない場合はエラーを出す
  //   proxy: {
  //     // PHPやMAMPで動作するリクエストをプロキシする
  //     '/': {
  //       target: 'http://localhost:8888', // MAMPのApacheデフォルトポート
  //       changeOrigin: true,
  //     },
  //   },
  // },
  build: {
    outDir: '../dist', // ビルド結果を出力
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input,
      output: {
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/i.test(name)) {
            return 'assets/images/[name][extname]';
          }
          if (/\.css$/i.test(name)) {
            return 'assets/css/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    liveReload([
      path.resolve(__dirname, 'htdocs/**/*.php'), // MAMPのPHPファイルを監視
    ]),
    viteImagemin({
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.7, 0.8] },
      gifsicle: { optimizationLevel: 2 },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'cleanupIDs', active: true },
        ],
      },
    }),
  ],
});
