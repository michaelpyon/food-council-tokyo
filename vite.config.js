import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    coverage: {
      branches: 82,
      exclude: [
        'src/**/*.test.{js,jsx}',
        'src/test/**',
      ],
      functions: 82,
      include: ['src/**/*.{js,jsx}'],
      lines: 82,
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      statements: 82,
    },
    environment: 'jsdom',
    maxWorkers: 1,
    setupFiles: './src/test/setup.js',
  },
})
