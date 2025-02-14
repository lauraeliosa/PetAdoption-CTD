import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  console.log("Netlify Injected Environment Variables:", env); // ✅ Debugging

  return {
    define: {
      'import.meta.env.VITE_CAT_API_KEY': JSON.stringify(env.VITE_CAT_API_KEY),
      'import.meta.env.VITE_DOG_API_KEY': JSON.stringify(env.VITE_DOG_API_KEY),
    },
  };
});
