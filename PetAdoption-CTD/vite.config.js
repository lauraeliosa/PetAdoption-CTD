import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.log("Vite Loaded Env Variables at Build:", env); // ✅ Debugging

  return {
    define: {
      'import.meta.env.VITE_CAT_API_KEY': JSON.stringify(process.env.VITE_CAT_API_KEY),
      'import.meta.env.VITE_DOG_API_KEY': JSON.stringify(process.env.VITE_DOG_API_KEY),
    },
  };
});

