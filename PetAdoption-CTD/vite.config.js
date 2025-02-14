import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    define: {
      'import.meta.env.VITE_CAT_API_KEY': JSON.stringify(process.env.VITE_CAT_API_KEY),
      'import.meta.env.VITE_DOG_API_KEY': JSON.stringify(process.env.VITE_DOG_API_KEY),
    },
  };
});
