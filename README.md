# rollup-plugin-custom-import

[![NPM Version](https://img.shields.io/npm/v/rollup-plugin-custom-import?style=for-the-badge)](https://www.npmjs.com/package/rollup-plugin-custom-import)
[![npm bundle size](https://img.shields.io/bundlephobia/min/rollup-plugin-custom-import?style=for-the-badge&label=bundle%20size)](https://packagephobia.com/result?p=rollup-plugin-custom-import)

🍣 A Rollup plugin to customize the content of the imported module - not just the text

## Install

Using npm:

```console
npm install --save-dev rollup-plugin-custom-import
```

## Usage

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/command-line-interface/#configuration-files) and import the plugin:

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
        return `export default ${JSON.stringify(originalContent)};`;
      },
    }),
  ],
};
```

Then call `rollup` either via the [CLI](https://www.rollupjs.org/command-line-interface/) or the [API](https://www.rollupjs.org/javascript-api/).

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
) => string | SourceDescription;
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

Type: `String` | `(id: string, originalCode: string) => string | SourceDescription`  
**Mandatory**

Specifies the content of the imported module.

For functions, the string or SourceDescription value returned by the function will be passed to Rollup to change the content of the file
The [plugin context](https://rollupjs.org/plugin-development/#plugin-context) will be `this` for the function

> `SourceDescription` is a rollup interface (see more in [Rollup Docs](https://rollupjs.org/plugin-development/#transform)):
>
> ```typescript
> interface SourceDescription extends Partial<PartialNull<ModuleOptions>> {
>   ast?: ProgramNode;
>   code: string;
>   map?: SourceMapInput;
> }
> interface ModuleOptions {
>   attributes: Record<string, string>;
>   meta: CustomPluginOptions;
>   moduleSideEffects: boolean | 'no-treeshake';
>   syntheticNamedExports: boolean | string;
> }
> ```

**Examples:**

```js
'export default "custom content";';
```

```js
(id, originalCode) => `export default ${JSON.stringify(originalCode)};`;
```

```js
(id, originalCode) => {{
  code: `export default ${JSON.stringify(originalCode)};`,
  map: null,
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
      content: (id, originalContent) =>
        `export default ${JSON.stringify(originalContent)};`,
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
      content: (id, originalContent) =>
        `const css = ${JSON.stringify(originalContent)};
const styleEl = document.createElement('style');
styleEl.innerHTML = css;
document.head.appendChild(styleEl);
export default css;`,
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
      content: (id, originalContent) =>
        `const html = ${JSON.stringify(originalContent)};
const div = document.createElement('div');
div.innerHTML = html;
export default div;`,
    }),
  ],
};
```

### Processing AST

```js
// rollup.config.js
import { customImport } from 'rollup-plugin-custom-import';

export default {
  // ...
  plugins: [
    customImport({
      include: ['**/*.js'],
      content(id, originalContent) => {
        // this.parse is a function provided by Rollup
        // learn more at https://rollupjs.org/plugin-development/#plugin-context
        const ast = this.parse(originalContent);
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
