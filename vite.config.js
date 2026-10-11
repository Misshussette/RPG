import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
 server: { proxy: { '/api': { target: 'http://127.0.0.1:3001', changeOrigin: false } } },
 build: { rollupOptions: { input: { legacy: resolve('index.html'), parity: resolve('parity.html') } } }
});
