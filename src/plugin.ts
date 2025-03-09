import type { Plugin } from 'rollup';
import type { Optionals } from './utils';
import type { FileContentSpecifier } from './file-content';
import { filterFile } from './utils';
import { createFilter } from '@rollup/pluginutils';

/** The plugin options */
export interface Options {
  /**
   * Specifies which import files will be processed by this plugin. Glob patterns are supported.
   *
   * For functions, take the individual import file name as a parameter,
   * and the Boolean value returned by the function will indicate whether or not to process the file
   *
   * @example ['\*\*\/*.css', '*.html', 'path/to/file']
   * @example (path) => path.endsWith('.css')
   */
  include: string[] | RegExp[] | ((path: string) => boolean);

  /**
   * Specifies which import files will not be processed by this plugin.
   * Values are handled in the same way as {@link Options.include}
   */
  exclude?: string[] | RegExp[] | ((path: string) => boolean);

  /**
   * Specifies the content of the imported file.
   */
  content: FileContentSpecifier;
}

/**
 * The default plugin options
 * @see {@link Options}
 */
export const defaultOptions: Optionals<Options> = {
  exclude: [],
};

export function customImport(opts: Options): Plugin {
  /** A configuration object that contains all configuration keys */
  const options: Required<Options> = Object.assign(
    defaultOptions,
    opts
  ) as Required<Options>;

  const filter = createFilter(
    // make sure that the include and exclude options are arrays
    typeof options.include === 'function' ? [] : options.include,
    typeof options.exclude === 'function' ? [] : options.exclude
  );

  return {
    name: 'custom-import',

    transform(code, id) {
      if (filterFile(id, filter, options)) {
        const content =
          typeof options.content === 'function'
            ? options.content(id, code)
            : options.content;
        return content;
      }
    },
  };
}
