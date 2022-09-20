import * as path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig, mergeConfig } from 'vite'
import type { UserConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const baseConfig: UserConfig = {
    base: '/',
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
    },
    plugins: [vue(), vueJsx()],
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    build: {
      cssCodeSplit: false,
      sourcemap: false,
      chunkSizeWarningLimit: 550,
      assetsInlineLimit: 4096,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  }

  const devConfig: UserConfig = {
    server: {
      host: '0.0.0.0',
    },
  }

  const buildConfig: UserConfig = {
    build: {
      rollupOptions: {
        external: ['vue', 'naive-ui'],
        output: {
          globals: {
            'vue': 'Vue',
            'naive-ui': 'naive',
          },
          exports: 'named',
        },
      },
      lib: {
        entry: 'src/index.ts',
        name: 'Formative',
        fileName: 'formative',
      },
    },
  }

  return mergeConfig(baseConfig, mode === 'development' ? devConfig : buildConfig, false)
})
