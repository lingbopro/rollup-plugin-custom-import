import type { SourceDescription } from 'rollup';

/**
 * Specifies the content of the file.
 *
 * For functions, the string value returned by the function will be passed to Rollup
 * to change the content of the file
 */
export type FileContentSpecifier = string | FileContentSetter;

/**
 * @param id The module id (path) of the file to be processed.
 * @param hook The hook that triggered the FileContentSetter
 * @param originalCode The original code of the file.
 * @returns The processed source of the file, passed to Rollup to change the content of the file
 */
export type FileContentSetter = (
  id: string,
  originalCode: string
) => string | SourceDescription;
