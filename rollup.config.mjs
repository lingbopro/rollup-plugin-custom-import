import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { builtinModules } from 'module';
import { readFile } from 'fs/promises';

/** @type {import('./package.json')} */
const packageJSON = JSON.parse(await readFile('./package.json'));

/** @type {import('rollup').RollupOptions} */
export default {
  input: './src/index.ts',
  output: [
    {
      file: packageJSON.main,
      format: 'cjs',
      sourcemap: true,
      plugins: [],
    },
    {
      file: packageJSON.module,
      format: 'esm',
      sourcemap: true,
      plugins: [],
    },
  ],
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
    }),
  ],
  external: [
    ...Object.keys(packageJSON.peerDependencies),
    ...Object.keys(packageJSON.dependencies),
    ...builtinModules,
  ],
};
