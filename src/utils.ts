import type { CreateFilter } from '@rollup/pluginutils';
import { SourceDescription } from 'rollup';
import { FileContentSpecifier } from './file-content';
import type { Options } from './plugin';

/**
 * Extracts the keys of optional properties from a type T.
 * @template T - The type to extract optional keys from.
 * @returns A union type of keys from T that are optional (i.e., can be undefined).
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

/**
 * Creates a new type with only the optional properties of T.
 * @template T - The type to extract optional properties from.
 * @returns A new type containing only the optional properties of T.
 */
export type Optionals<T> = Pick<T, OptionalKeys<T>>;

export function filterFile(
  id: string,
  filter: ReturnType<CreateFilter>,
  options: Required<Options>
): boolean {
  let included: boolean = filter(id);
  if (typeof options.include === 'function') {
    included = options.include(id);
  }
  if (typeof options.exclude === 'function') {
    included = included && !options.exclude(id);
  }
  return included;
}

export function getFileContent<self>(
  specifier: FileContentSpecifier,
  _this: self,
  id: string,
  originalCode: string
): SourceDescription {
  if (typeof specifier === 'string') {
    return {
      code: specifier,
      map: null,
    };
  } else if (typeof specifier === 'function') {
    const ret = specifier.call(_this, id, originalCode);
    if (typeof ret === 'object') {
      if (typeof ret.code !== 'string')
        throw new TypeError(
          'The returned SourceDescription of the content function must have a code property'
        );
      return ret;
    } else
      throw new TypeError(
        'The return value of the content function must be SourceDescription'
      );
  } else
    throw new TypeError(
      'Invalid content specifier. It should be a string or a function'
    );
}
