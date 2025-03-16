# rollup-plugin-custom-import

[![NPM Version](https://img.shields.io/npm/v/rollup-plugin-custom-import?style=for-the-badge)](https://www.npmjs.com/package/rollup-plugin-custom-import)
[![npm bundle size](https://img.shields.io/bundlephobia/min/rollup-plugin-custom-import?style=for-the-badge&label=bundle%20size)](https://packagephobia.com/result?p=rollup-plugin-custom-import)

🍣 A Rollup plugin to customize the content of the imported module - not just the text

## Install

WIP

<!-- Using npm / yarn / pnpm:

```console
npm install --save-dev rollup-plugin-custom-import
```

```console
yarn add --dev rollup-plugin-custom-import
```

```console
pnpm add --save-dev rollup-plugin-custom-import
``` -->

## Usage

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin:

```js
// rollup.config.js
import { customImport } from 'rollup-plugin-custom-import';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'output',
    format: 'cjs',
  },
  plugins: [
    customImport({
      // see behind for config details
      include: [''],
      content: (id, originalContent) => {
        return {
          code: `export default ${JSON.stringify(originalContent)};`,
        };
      },
    }),
  ],
};
```

Then call `rollup` either via the [CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the [API](https://www.rollupjs.org/guide/en/#javascript-api).

## Options

Options interface is shown below:

```typescript
interface Options {
  include: string[] | RegExp[] | ((path: string) => boolean);
  exclude?: string[] | RegExp[] | ((path: string) => boolean);
  content: FileContentSpecifier;
}

export type FileContentSpecifier = string | FileContentSetter;

export type FileContentSetter = (
  id: string,
  originalCode: string
) => SourceDescription;
```

details:

### `include`

Type: `String[]` | `RegExp[]` | `((path: string) => boolean)`  
**Mandatory**

Specifies which import files will be processed by this plugin. Glob patterns are supported.

For functions, take the individual import file name as a parameter, and the Boolean value returned by the function will indicate whether or not to process the file

**Examples:**

```js
['**/*.css', '*.html', 'path/to/file'];
```

```js
(path) => path.endsWith('.css');
```

### `exclude`

Type: `String[]` | `RegExp[]` | `((path: string) => boolean)`  
Default: `[]`

Specifies which import files will not be processed by this plugin.
Values are handled in the same way as [`include`](#include)

### `content`

Type: `String` | `(id: string, originalCode: string) => SourceDescription`  
**Mandatory**

Specifies the content of the imported module.

For functions, the string value returned by the function will be passed to Rollup to change the content of the file

**Examples:**

```js
'export default "custom content";';
```

```js
(id, originalCode) => {{
  code: `export default ${JSON.stringify(originalCode)};`,
}}
```

## Examples

### Import TXT files as a string

```js
// rollup.config.js
import { customImport } from 'rollup-plugin-custom-import';

export default {
  // ...
  plugins: [
    customImport({
      include: ['**/*.txt'],
      content: (id, originalContent) => {
        return {
          code: `export default ${JSON.stringify(originalContent)};`,
        };
      },
    }),
  ],
};
```

### Import & Inject CSS files

```js
// rollup.config.js
import { customImport } from 'rollup-plugin-custom-import';

export default {
  // ...
  plugins: [
    customImport({
      include: ['**/*.css'],
      content: (id, originalContent) => {
        return {
          code: `const css = ${JSON.stringify(originalContent)};
const styleEl = document.createElement('style');
styleEl.innerHTML = css;
document.head.appendChild(styleEl);
export default css;`,
        };
      },
    }),
  ],
};
```

### Import Parsed HTML files

```js
// rollup.config.js
import { customImport } from 'rollup-plugin-custom-import';

export default {
  // ...
  plugins: [
    customImport({
      include: ['**/*.html'],
      content: (id, originalContent) => {
        return {
          code: `const html = ${JSON.stringify(originalContent)};
const div = document.createElement('div');
div.innerHTML = html;
export default div;`,
        };
      },
    }),
  ],
};
```

### Processing AST

```js
// rollup.config.js
import { customImport } from 'rollup-plugin-custom-import';
import { parse } from '@babel/parser';

export default {
  // ...
  plugins: [
    customImport({
      include: ['**/*.js'],
      content: (id, originalContent) => {
        const ast = parse(originalContent);
        const processed = doSomething();
        const yourCode = doAnotherThing();
        return {
          code: yourCode,
          ast: processed,
        };
      },
    }),
  ],
};
```

## License

[MIT](./LICENSE)
