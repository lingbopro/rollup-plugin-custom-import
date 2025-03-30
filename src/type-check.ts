import { FileContentSetter, FileContentSpecifier } from './file-content';
import { Options } from './plugin';

export function checkOptions(target: Options, varName: string = 'Options') {
  if (typeof target.include !== 'function' && !Array.isArray(target.include)) {
    throw new TypeError(`${varName}.include must be a function or an array`);
  }
  if (typeof target.exclude === 'function' && !Array.isArray(target.exclude)) {
    throw new TypeError(`${varName}.exclude must be a function or an array`);
  }
  checkFileContentSpecifier(target.content, `${varName}.content`);
}

export function checkFileContentSpecifier(
  target: FileContentSpecifier,
  varName: string = 'FileContentSpecifier'
) {
  if (typeof target !== 'string' && typeof target !== 'function') {
    throw new TypeError(`${varName} must be an string or a function`);
  }
}

export function checkFileContentSetterReturnValue(
  target: ReturnType<FileContentSetter>,
  varName: string = 'FileContentSetter'
) {
  if (typeof target === 'object' && typeof target.code !== 'string') {
    throw new TypeError(
      `SourceDescription returned by ${varName} must have a code property of type string`
    );
  } else {
    throw new TypeError(`${varName} must return a string or an object`);
  }
}
