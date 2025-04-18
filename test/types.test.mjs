import test from 'ava';
import { testTypeCheck } from './helpers/type.mjs';

test('Options.include', async (t) => {
  await testTypeCheck(
    t,
    'include',
    [114514, 'single-string', new RegExp('single-regexp'), {}, null, undefined],
    [() => true, ['test/**/*.js'], [/hello.world/]]
  );
});

test('Options.exclude', async (t) => {
  await testTypeCheck(
    t,
    'exclude',
    [114514, 'single-string', new RegExp('single-regexp'), {}, null, undefined],
    [() => true, ['test/**/*.js'], [/hello.world/]]
  );
});

test('Options.content (FileContentSpecifier)', async (t) => {
  await testTypeCheck(
    t,
    'content',
    [1919810, [], {}, /lol/, new Error(), null, undefined],
    ['I am a string', (id, original) => ({ code: original })]
  );
});

test('Options.content (FileContentSetter) return value', async (t) => {
  await testTypeCheck(
    t,
    'content',
    [
      () => true,
      () => false,
      () => 114514,
      () => [],
      () => ({}),
      () => new Error(),
      () => null,
      () => undefined,
      () => {},
      () => ({ map: 'no code property lol' }),
    ],
    [
      () => "export default ''",
      () => ({ code: "export default 'awa'" }),
      (id, original) => ({ code: original, map: null }),
    ],
    true
  );
});
