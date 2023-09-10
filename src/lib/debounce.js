/**
 * 
 * @param {Function} fn 
 * @param {Number} milliseconds 
 * @returns 
 */
export let debounce = (fn, milliseconds) => {
  /**
   * @type {string | number | NodeJS.Timeout | undefined}
   */
  let debounceTimer;
  return function () {
    // @ts-ignore
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fn.apply(context, args), milliseconds);
  }
}