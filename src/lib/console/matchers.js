import { BracketedMatcher } from "./completion.js";

export class NumberMatcher extends BracketedMatcher {
  /**
   * 
   * @param {string} name 
   */
  constructor(name) {
    super(/\{\d+\}/g, name);
  }
 
  /**
   * Return the next match and its last index
   * @param {string} completed 
   * @param {number} startIndex  the index in completed to start the current search at.
   * @returns 
   */
  next(completed, startIndex) {
    super.next(completed, startIndex);
    if (this.lastValue !== null)
      this.lastValue = Number(this.lastValue);
    return this.matched();
  }
}

export class WordMatcher extends BracketedMatcher {
  /**
   * 
   * @param {string} name 
   */
  constructor(name) {
    super(/\{\w+\}/g, name);
  }
}

export class SideMatcher extends BracketedMatcher {
  /**
   * 
   * @param {string} name 
   */
  constructor(name) {
    super(/\{(north|west|south|east|North|West|South|East)\}/g, name);
  }

  next(completed, startIndex) {
    super.next(completed, startIndex);
    if (this.lastValue !== null)
      // this.lastValue = {north:0, west:1, south:2, east:3}[this.lastValue.toLowerCase()] ?? null;
      this.lastValue = this.lastValue.toLowerCase();
    return this.matched();
  }
}