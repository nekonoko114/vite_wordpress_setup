import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs'; // fsを静的に読み込む
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({

  root: 'src', // プロジェクトルートを `src` に変更
  base: './', // 相対パスで出力
  build: {
    outDir: '../dist', // ビルド成果物をプロジェクトルート外に出力
    assetsDir: 'assets', // 静的アセットのディレクトリ
    emptyOutDir: true, // プロジェクトルート外でもディレクトリをクリアする
    cssCodeSplit: true, // CSSを分割
    minify: false, // 圧縮を無効化   オプション圧縮の有効化:esbuild 無効化: false
    // minify: 'esbuild', // デフォルトの圧縮方法
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
  publicDir: false, // public フォルダを使わない
  plugins: [
    {
      name: 'copy-images',
      apply: 'build',
      generateBundle() {
        const sourceDir = path.resolve(__dirname, 'src/assets/images');
        const outputDir = path.resolve(__dirname, 'dist/assets/images');

        const copyRecursiveSync = (src, dest) => {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          fs.readdirSync(src).forEach((file) => {
            const srcFile = path.join(src, file);
            const destFile = path.join(dest, file);

            if (fs.lstatSync(srcFile).isDirectory()) {
              copyRecursiveSync(srcFile, destFile);
            } else {
              fs.copyFileSync(srcFile, destFile);
            }
          });
        };

        copyRecursiveSync(sourceDir, outputDir);
      },
    },
    viteImagemin({
        mozjpeg: {
          quality: 80, // JPEGの圧縮品質（0〜100）
        },
        pngquant: {
          quality: [0.7, 0.8], // PNGの圧縮品質（範囲で指定）
        },
        gifsicle: {
          optimizationLevel: 2, // GIFの圧縮レベル（1〜3）
        },
        svgo: {
          plugins: [
            { name: 'removeViewBox', active: false }, // SVGの`viewBox`を残す
            { name: 'cleanupIDs', active: true },     // 不要なIDを削除
          ],
        },
        webp: {
          quality: 80, // WebPの圧縮品質（0〜100）
        },
      }),
  ],
});
