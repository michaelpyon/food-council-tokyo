import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    coverage: {
      exclude: [
        'src/**/*.test.{js,jsx}',
        'src/test/**',
      ],
      include: ['src/**/*.{js,jsx}'],
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      thresholds: {
        branches: 82,
        functions: 82,
        lines: 82,
        statements: 82,
      },
    },
    environment: 'jsdom',
    maxWorkers: 1,
    setupFiles: './src/test/setup.js',
  },
})
