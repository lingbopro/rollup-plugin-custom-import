import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rollup } from 'rollup';
import { customImport } from '../../dist/index.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export async function doTest(opts, runRollup = false) {
  if (runRollup) {
    const ret = customImport(opts);
    await rollup({
      input: path.resolve(__dirname, '../fixtures/existing.js'),
      plugins: [ret],
    });
  } else {
    const ret = customImport(opts);
    return ret;
  }
}

/**
 *
 * @param {import('ava').ExecutionContext} t
 * @param {string} propName
 * @param {array} wrongValues
 * @param {array} correctValues
 * @param {object} [otherOptions]
 */
export async function testTypeCheck(
  t,
  propName,
  wrongValues,
  correctValues,
  runRollup = false,
  otherOptions = { include: [], exclude: [], content: () => '' }
) {
  for (const wrongValue of wrongValues) {
    const opts = { ...otherOptions, [propName]: wrongValue };
    // console.debug({ opts });
    await t.throwsAsync(() => {
      const ret = doTest(opts, runRollup);
      t.log('Not throwing exception:', opts);
      return ret;
    });
  }
  for (const correctValue of correctValues) {
    const opts = { ...otherOptions, [propName]: correctValue };
    await t.notThrowsAsync(() => doTest(opts, runRollup));
  }
}
