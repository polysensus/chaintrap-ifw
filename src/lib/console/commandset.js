
export class CommandSet {

  constructor() {
    /** @type {Object.<string,{completion: import('./completion.js').Completion, callback:Function}>} */
    this.completions = {}
    /** @type {string[]} */
    this.priority = []
  }

  /**
   * 
   * @param {string} phrase 
   * @returns {{completion:import('./completion.js').Completion, callback:Function}|undefined}
   */
  match(phrase) {
    for (const prefix of this.priority) {
      const {completion, callback} = this.completions[prefix];
      if (completion.match(phrase))
        return {completion, callback};
    }
    return undefined;
  }

  /** pushfront adds the commpletion and callback at the front of the match set
   * @param {import('./completion.js').Completion} completion
   * @param {Function} callback
  */
  pushfront(completion, callback) {
    this._addCompletion(completion, callback);
    this.priority = [completion.prefix,...this.priority];
  }

  /** pushfront adds the commpletion and callback at the front of the match set
   * @param {import('./completion.js').Completion} completion
   * @param {Function} callback
  */
  append(completion, callback) {
    this._addCompletion(completion, callback);
    this.priority.push(completion.prefix);
  }

  /**
   * remove a completion identified by its prefix
   * @param {string} prefix 
   */
  remove(prefix) {
    this.priority = this.priority.filter((value)=>value !== prefix)
    delete this.completions[prefix];
  }

  /**
   * removeMany completions identified by their prefixes
   * @param {...string} prefix 
   */
  removeMany(...prefix) {
    for (const p of prefix)
      this.remove(p)
  }

  /** pushfront adds the commpletion and callback at the front of the match set
   * @param {import('./completion.js').Completion} completion
   * @param {Function} callback
  */
  _addCompletion(completion, callback) {
    if (this.completions[completion.prefix])
      this.remove(completion.prefix);

    this.completions[completion.prefix] = {
      completion, callback
    }
  }
}