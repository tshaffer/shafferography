import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        hmr: false, // Disable Hot Module Replacement

        proxy: {
            '/api': {
                target: 'http://localhost:8080', // Backend URL
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
