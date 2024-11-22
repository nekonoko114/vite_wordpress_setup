import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src', // プロジェクトルートを `src` に変更
  base: './', // 相対パスで出力
  build: {
    outDir: '../dist', // ビルド成果物をプロジェクトルート外に出力
    assetsDir: 'assets', // 静的アセットのディレクトリ
    emptyOutDir: true, // プロジェクトルート外でもディレクトリをクリアする
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'), // `src/index.html` をエントリポイントとして指定
      },
      output: {
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/i.test(name)) {
            return 'assets/images/[name][extname]'; // 画像ファイルの出力先
          }
          if (/\.css$/i.test(name)) {
            return 'assets/css/[name][extname]'; // CSSファイルの出力先
          }
          return 'assets/[name][extname]'; // その他のアセットの出力先
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
  scss: {
    additionalData: `@use "@/assets/scss/module/_variable" as *;`, // グローバル変数をすべてのSCSSで利用可能に
  },
});
