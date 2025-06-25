import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      // Vue 컴파일러 옵션
      template: {
        compilerOptions: {
          // 개발 모드에서 더 나은 디버깅
          isCustomElement: (tag) => tag.startsWith('custom-'),
        },
      },
    }),
    vueDevTools(),
  ],

  // 개발 서버 설정 (HMR 최적화)
  server: {
    port: 3001, // package.json의 dev:3001과 일치
    host: true, // 외부 접근 허용 (네트워크에서 접근 가능)
    open: true, // 브라우저 자동 열기

    // HMR 설정
    hmr: {
      overlay: true, // 에러 오버레이 표시
      clientPort: 3001, // HMR WebSocket 포트 명시
    },

    // 파일 감시 설정
    watch: {
      usePolling: false, // 기본값: false (성능상 유리)
      interval: 100, // polling 간격 (usePolling: true일 때만)
    },

    // CORS 설정 (필요시)
    cors: true,

    // 프록시 설정 (API 서버가 있다면)
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  },

  // 빌드 설정
  build: {
    sourcemap: true, // 개발용 소스맵 (디버깅에 도움)
    minify: 'esbuild', // 빠른 빌드
    target: 'esnext', // 최신 브라우저 타겟

    // 청크 분할 최적화
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
        },
      },
    },
  },

  // 경로 별칭
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
    },
  },

  // CSS 설정
  css: {
    devSourcemap: true, // CSS 소스맵 (개발용)
    preprocessorOptions: {
      scss: {
        // SCSS 전역 변수 (필요시)
        // additionalData: `@import "@/assets/styles/variables.scss";`
      },
    },
  },

  // 개발 환경 최적화
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia'], // 사전 번들링할 의존성
    exclude: ['vite-plugin-vue-devtools'], // 제외할 의존성
  },

  // 환경 변수 설정
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
})
