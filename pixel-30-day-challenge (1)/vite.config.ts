
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Maps the VITE_API_KEY from .env to process.env.API_KEY for the SDK
      // Using the provided user API key directly as requested
      'process.env.API_KEY': JSON.stringify('progresscalenderL2g96YDcbvyFlstCr9vqq8iX6BSdtR54veLyjagthDDZepTmlSgYefRGhgruShmIJEhaW0nDGhj8yWYvIZfVeojW1sLNwqGGpjBtxogW5U0h4HMNMxnBQkyUvRwo2iUjyf8Mvwyl0MYFuhKpEMWrFAJI2ztrFF5klwYSpSF8jKS2cJDHsZYTu8CmywIgb5d0qQrdeS5qV6k8mUhi4TajfTCH7a5jcwYdAyIX3SNjOUy0lbF0GeEtIKiXAvyrv0F9'),
    }
  };
});
