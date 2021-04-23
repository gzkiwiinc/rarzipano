import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import sourcemaps from "rollup-plugin-sourcemaps";

import pkg from "./package.json";

export default {
  input: './src/index.ts',
  output: [
    {
      format: 'es',
      file: pkg.module,
      sourcemap: false,
      name: 'Rarzipano',
    },
    {
      format: 'cjs',
      file: pkg.main,
      sourcemap: false,
      name: 'Rarzipano',
    }
  ],
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true, // only compile defs in es format
          declarationDir: 'lib/types',
          module: 'es2015',
        },
      },
      useTsconfigDeclarationDir: true,
    }),
    resolve(),
    sourcemaps(),
  ],
  external: ["react", "react-dom", "marzipano"],
}