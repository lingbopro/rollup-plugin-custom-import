import type { CreateFilter } from '@rollup/pluginutils';
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
