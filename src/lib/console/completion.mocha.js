import { expect } from "chai";

import { Completion} from "./completion.js";
import { NumberMatcher, SideMatcher } from "./matchers.js";

describe("command completion tests", function () {
  it("Should complete with 2 numbers", function () {

    const c = new Completion(
      {phrase: 'use exit \{${number}\} on the \{${side}\}', prefix:'use exit'},
      new NumberMatcher("exit"),
      new NumberMatcher("side"),
    );
    const ok = c.match('use exit {1} on the {2}');
    expect(ok).to.equal(true);
    expect(c?.result?.values["exit"]).to.equal(1);
    expect(c?.result?.values["side"]).to.equal(2);
  });
  it("Should complete with 1 number and one side", function () {

    const c = new Completion(
      {phrase:'use exit \{${number}\} on the \{${side}\}', prefix:'use exit'},
      new NumberMatcher("exit"),
      new SideMatcher("side")
    );
    let ok = c.match('use exit {1} on the {east}');
    expect(ok).to.equal(true);
    expect(c?.result?.values["exit"]).to.equal(1);
    expect(c?.result?.values["side"]).to.equal("east");

    ok = c.match('use exit {1} on the {North}');
    expect(ok).to.equal(true);
    expect(c?.result?.values["exit"]).to.equal(1);
    expect(c?.result?.values["side"]).to.equal("north");
  });

  it("Should complete with no parameters", function () {

    const c = new Completion(
      {phrase:'start game', prefix:'start game'}
    );
    let ok = c.match('start game');
    expect(ok).to.equal(true);
  });
});