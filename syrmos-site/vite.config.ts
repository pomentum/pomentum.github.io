import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** The words files' TODO(verify) lists are for the editors: shown in development, left out of the published build. */
function dropVerify(): Plugin {
  return {
    name: "drop-verify",
    apply: "build",
    transform(code, id) {
      if (!/[\\/]content[\\/]en[\\/][^\\/]+\.ts$/.test(id)) return null;
      return { code: code.replace(/\n {2}verify: \[[\s\S]*?\n {2}\],?\n/g, "\n"), map: null };
    },
  };
}

// The built site is written to ../syrmos/, which the pages workflow publishes at www.pomentum.dev/syrmos/.
// base "./": the build works at any path, since routing is by hash.
export default defineConfig({
  base: "./",
  plugins: [dropVerify(), react()],
  build: { outDir: "../syrmos", assetsDir: "static", emptyOutDir: true, sourcemap: false },
  server: { port: 5180, strictPort: true },
  preview: { port: 5181, strictPort: true },
});
