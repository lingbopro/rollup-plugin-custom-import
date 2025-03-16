import test from 'ava';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { rollup } from 'rollup';
import { customImport } from '../dist/index.mjs';
import { execESM } from './helpers/eval.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

test('type', (t) => {
  t.is(typeof customImport, 'function');
});

test('import an existing file', async (t) => {
  const bundle = await rollup({
    input: path.resolve(__dirname, 'fixtures/existing.js'),
    plugins: [
      customImport({
        include: ['**/file.js'],
        content: (id, original) => {
          return {
            code: `export default 'FILE';`,
            map: null,
          };
        },
      }),
    ],
  });
  const output = await bundle.generate({ format: 'esm' });
  // check bundle exported string
  const exported = await execESM(output.output[0].code);
  t.true(output.output[0].exports.includes('default'));
  t.is(exported.default, 'FILE');
});

test('filter do not match', async (t) => {
  const bundle = await rollup({
    input: path.resolve(__dirname, 'fixtures/existing.js'),
    plugins: [
      customImport({
        include: ['not/matching.js'],
        content: (id, original) => {
          return {
            code: `export default 'FILE';`,
            map: null,
          };
        },
      }),
    ],
  });
  const output = await bundle.generate({ format: 'esm' });
  // check bundle exported string
  const exported = await execESM(output.output[0].code);
  t.true(output.output[0].exports.includes('default'));
  t.is(exported.default, 'ORIGINAL');
});

test('throw error when importing a not existing file', async (t) => {
  try {
    const bundle = await rollup({
      input: path.resolve(__dirname, 'fixtures/not-existing.js'),
      plugins: [
        customImport({
          include: ['**/file.js'],
          content: (id, original) => {
            return {
              code: `export default 'FILE';`,
              map: null,
            };
          },
        }),
      ],
    });
  } catch (error) {
    t.is(error.code, 'UNRESOLVED_IMPORT');
    return;
  }
  t.fail();
});

test('original content', async (t) => {
  let originalContent;
  const bundle = await rollup({
    input: path.resolve(__dirname, 'fixtures/existing.js'),
    plugins: [
      customImport({
        include: ['**/file.js'],
        content: (id, original) => {
          originalContent = original;
          return {
            code: original,
          };
        },
      }),
    ],
  });
  const realContent = await readFile(
    path.resolve(__dirname, 'fixtures/file.js'),
    'utf-8'
  );
  t.is(originalContent, realContent);
});

const pluginContextKeys = [
  'addWatchFile',
  'cache',
  'debug',
  'emitFile',
  'error',
  'getFileName',
  'getModuleIds',
  'getModuleInfo',
  'getWatchFiles',
  'info',
  'load',
  'meta',
  'parse',
  'resolve',
  'setAssetSource',
  'warn',
  'getCombinedSourcemap',
];
test('plugin context', async (t) => {
  let keys;
  const bundle = await rollup({
    input: path.resolve(__dirname, 'fixtures/existing.js'),
    plugins: [
      customImport({
        include: ['**/file.js'],
        content(id, original) {
          keys = Object.keys(this);
          return {
            code: original,
          };
        },
      }),
    ],
  });
  t.deepEqual(keys, pluginContextKeys);
});
