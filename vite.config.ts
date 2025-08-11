import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
                    allowedHosts: [
                  "646ba3989f32.ngrok-free.app", // Current ngrok URL
                  "2cedf77407ae.ngrok-free.app", // Previous ngrok URL
                  "9087ca341829.ngrok-free.app", // Previous ngrok URL
                  "4b48b88db1f0.ngrok-free.app", // Previous ngrok URL
                  "694b6a1686f2.ngrok-free.app", // Previous ngrok URL
                  "localhost",
                  "127.0.0.1"
                ],
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
