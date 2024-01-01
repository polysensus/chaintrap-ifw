// defines all of the standard completions supported by the game
import { Completion } from '$lib/console/completion.js';
import { NumberMatcher, SideMatcher, WordMatcher } from '$lib/console/matchers.js';

export class CommandCompletions {

  /**
   * 
   * @param {string} name 
   * @returns {Completion}
   */
  static get(name) {
    return CommandCompletions.completionFactories[name]()
  }

  static create_game = "create game";
  static join_game = "join game";
  static set_start_for_player = "set start for player";
  static start_game = "start game";
  static use_exit = "use exit";
  static open_chest = "open chest";
  static narrate = "narrate";

  /** @type {Object.<string, Function>} */
  static completionFactories = {
    "create game": () => new Completion(
      {phrase:'create game for \{${count}\} players', prefix:'create game'},
      new NumberMatcher("count")),

    "join game": () => new Completion(
      {phrase:'join game as \{${nickname}\}', prefix:'join game'},
      new WordMatcher("nickname")),

    "set start for player": () => new Completion(
      {phrase:'set start for player \{${index}\} to location \{${location}\}', prefix:'set start for player'},
      new NumberMatcher("index"), new NumberMatcher("location")),

    "start game": () => new Completion(
      {phrase:'start game', prefix:'start game'}),

    "use exit": () => new Completion(
      {phrase:'use exit \{${exitNumber}\} on \{${side}\}', prefix:'use exit'},
      new NumberMatcher("exitNumber"), new SideMatcher("side")),

    "leave by": () => new Completion(
      {phrase:'leave by the \{${side}\} exit', prefix:'leave by'},
      new SideMatcher("side")),

    "open chest": () => new Completion(
      {phrase:'open chest \{${number}\}', prefix:'open chest'},
      new NumberMatcher("number")),

    // TODO: add a {prompt} field to be used for narrative generation
    "narrate": () => new Completion(
      {phrase:'narrate', prefix:'narrate'}),
  }
}