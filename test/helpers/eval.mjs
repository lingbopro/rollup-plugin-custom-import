/**
 * Evaluates the given code as an ESM module and returns the default export.
 *
 * @param {string} code - The code to evaluate.
 * @returns {Promise<any>} A promise that resolves to the default export of the evaluated code.
 */
export async function execESM(code) {
  const moduleCode = encodeURIComponent(code);
  const dataUrl = `data:application/javascript; charset=utf-8,${moduleCode}`;
  const evaluatedModule = await import(dataUrl);
  return evaluatedModule;
}
