import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false,
  outDir: 'build',
  target: 'node20',
  splitting: true,           // Enable code splitting for routes
  minify: false,
  sourcemap: false,
  clean: true,
  keepComments: true,
  /**
   * ⚠️ This ensures TypeORM decorators work after build
   */
  esbuildOptions(options) {
    options.keepNames = true;
    options.legalComments = 'external';
    options.banner = {
      js: '//! Swagger annotations preserved'
    }
  },
  skipNodeModulesBundle: true,
});
