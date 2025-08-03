import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Disable DTS generation for now due to Prisma client conflicts
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@prisma/client'],
  treeshake: true,
  esbuildOptions(options) {
    options.external = [...(options.external || []), '@prisma/client'];
  },
});