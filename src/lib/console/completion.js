export class Matcher {
   /**
    * 
    * @param {RegExp} pattern 
    * @param {string} name
    */
   constructor(pattern, name) {
     this.pattern = pattern;
     this.name = name;
     /** @type {number|string|undefined|null} */
     this.lastValue = undefined;
   }
 
   /**
    * Return the next match and its last index
    * @param {string} completed 
    * @param {number} startIndex  the index in completed to start the current search at.
    * @returns 
    */
   next(completed, startIndex = 0) {
     this.pattern.lastIndex = startIndex;
     const m = this.pattern.exec(completed);
     if (m === null || (m.length ?? 0) === 0) {
       this.lastValue = null;
       return this.matched();
     }
 
     // @ts-ignore
     this.lastValue = m[0];
     return this.matched();
   }
   matched() {
     return [this.lastValue, this.pattern.lastIndex];
   }
}

export class BracketedMatcher extends Matcher {
  /**
   * 
   * @param {RegExp} pattern
   * @param {string} name 
   */
  constructor(pattern, name) {
    super(pattern, name);
  }
 
  /**
   * Return the next match and its last index
   * @param {string} completed 
   * @param {number} startIndex  the index in completed to start the current search at.
   * @returns 
   */
  next(completed, startIndex) {
    super.next(completed, startIndex);
    if (this.lastValue !== null) {
      // remove the '{' and '}'
      // @ts-ignore
      this.lastValue = stripFirstAndLast(this.lastValue);
    }
    return this.matched();
  }
}

export class MatchResult {
  /**
   * 
   * @param {string|undefined} prefix the matched prefix 
   * @param {object|undefined} values 
   * @param {string[]|undefined} order 
   * @param {{name:string, index:number}|undefined} missing 
   */
  constructor(prefix, values, order, missing=undefined) {
    this.prefix = prefix;
    this.values = values;
    this.order = order;
    this.missing = missing;
  }

  ok () {
    return (typeof this.prefix  != undefined && this.values && this.order && !this.missing);
  }
}
// 
export class Completion {
  snippetCompletion() {
    throw new Error("Method not implemented.");
  }

  /**
   * 
   * @param {{phrase:string,prefix:string}} completion 
   * @param  {...{next:Function}} matchers 
   */
  constructor(completion, ...matchers) {
    if (!completion.phrase)
      throw new Error(`a completion requires a phrase`);
    if (!completion.prefix)
      throw new Error(`a completion requires a prefix`);
    this.phrase = completion.phrase;
    this.prefix = completion.prefix;
    this.matchers = matchers;
    /** @type {MatchResult|undefined} */
    this.result = undefined;
  }

  /**
   * 
   * @param {string} completed 
   */
  match(completed) {
    completed = this.conditionInput(completed);

    if (!completed.startsWith(this.prefix)) {
      this.result = new MatchResult(undefined, undefined, undefined);
      return false;
    }

    const values = {}
    const order = [];
    let value, startIndex=0;
    for (let i=0; i<this.matchers.length; i++) {
      const m = this.matchers[i];
      ([value, startIndex] = m.next(completed, startIndex));
      if (value === null) {
        // @ts-ignore
        this.result = new MatchResult(this.prefix, values, order, {name:m.name, index:i});
        return false;
      }
      // @ts-ignore
      values[m.name] = value;
      // @ts-ignore
      order.push(m.name);
    }
    this.result = new MatchResult(this.prefix, values, order);
    return true;
  }

  /**
   * conditionInput takes the unsanitized input and prepare it for matching
   * @param {string} completed 
   * @returns 
   */
  conditionInput(completed) {
    return stripNewlines(completed)
  }
}
// 
/**
 * Remove newlines from s
 * @param {string} s 
 * @returns {string}
 */
export function stripNewlines(s) {return s.replace(/\n/g, "");}

/**
 * 
 * @param {string} s 
 * @returns {string}
 */
export function stripFirstAndLast(s) { return s.slice(1, s.length - 1); }