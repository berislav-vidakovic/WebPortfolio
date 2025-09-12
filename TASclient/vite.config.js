import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,   // <-- change your port here
    host: true,   // optional: allow access from LAN / Docker
  },
});
