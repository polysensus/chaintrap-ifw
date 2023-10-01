import { expect } from "chai";
import {deleteDB} from 'idb';

import { TrialContent, Stores as TrialStores } from "./trialcontent.js";
import maps02 from "../../../static/content/maps/map02.json" assert { type: "json" };
import maps01 from "../../../static/content/maps/map01-model-two-rooms.json" assert { type: "json" };
import map02codex from "../../../static/content/maps/map02.codex.json" assert { type: "json" };

const TESTDB='test-trialcontent';

let betaId = 1;
function nextBeta() {
  const beta = `beta${betaId}`;
  betaId += 1;
  return beta;
}

/**
 * @param {number} ms 
 * @returns 
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("idb trialcontent tests", async function () {
  beforeEach(async function() {
    this.db = new TrialContent({name:TESTDB});
    await this.db.create();
  });

  afterEach(async function() {
    this.db.close();
    while (true) {
      let blocked = false;
      await deleteDB(TESTDB, {
        blocked() {
          blocked = true;
        }
      });
      if (blocked)
        await sleep(500);
      break;
    }
  });

  it("should pass", async function () {
    console.log('ok');
  });

  it("Should have database", async function () {
    expect(this.db).to.exist;
    expect(this.db.db).to.exist;
  });


  it("Should save a map", async function () {
    const r = await this.db.mapAdd(maps02['map02']);
    const map = await this.db.mapByBeta(maps02['map02'].vrf_inputs.proof.beta);
    expect(map).to.exist;
  });

  it("Should save a codex", async function () {
    await this.db.addCodex(map02codex);
    const count = await this.db.count(TrialStores.Codices)
    expect(count).to.equal(1);
  });

  it("Should count 1 new map", async function () {
    await this.db.mapAdd(maps02['map02']);
    const count = await this.db.count(TrialStores.Maps)
    // this is racy could be flaky
    expect(count).to.equal(1);
  });

  it("Should get last of two maps", async function () {
    await this.db.mapAdd(maps02['map02']);
    await this.db.mapAdd(maps01['map01']);
    const count = await this.db.count(TrialStores.Maps);
    expect(count).to.equal(2);
    const map = await this.db.mapLast();
    expect(map.vrf_inputs.proof.beta).to.equal(maps01['map01'].vrf_inputs.proof.beta);
  });

  it("Should create a single furnishing", async function() {
    await this.db.furntitureAdd('aaaa', {unique_name:'one', labels:['victory_condition'], data:{location: 8, side:0, exit: 0},meta:{}});
  });

  it("Should create a single furnishing with an undefined unique_name", async function() {
    await this.db.furntitureAdd('aaaa', {labels:['victory_condition'], data:{location: 8, side:0, exit: 0},meta:{}});
  });
  it("Should create two furnishings with an undefined unique_names", async function() {
    await this.db.furntitureAdd('aaaa', {labels:['victory_condition'], data:{location: 8, side:0, exit: 0},meta:{}});
    await this.db.furntitureAdd('aaaa', {labels:['victory_condition'], data:{location: 8, side:0, exit: 0},meta:{}});
  });

  it("Should count two furniture item", async function() {
    const beta = 'aaaa';
    await this.db.furntitureAdd(beta, {labels:['victory_condition'], data:{location: 8, side:0, exit: 0},meta:{}});
    await this.db.furntitureAdd(beta, {labels:['victory_condition'], data:{location: 8, side:0, exit: 0},meta:{}});
    const count = await this.db.furnitureCount(beta);
    expect(count).to.equal(2);
  });

  it("Should get last of two furniture item", async function() {
    const beta = 'aaaa';
    await this.db.furntitureAdd(beta, {labels:['victory_condition'], data:{location: 1, side:0, exit: 0},meta:{}});
    await this.db.furntitureAdd(beta, {labels:['victory_condition'], data:{location: 2, side:0, exit: 0},meta:{}});
    const last = await this.db.furntitureLast(beta);
    expect(last?.data?.location).to.equal(2);
  });
  it("Should delete one of two furniture items", async function() {
    const beta = 'aaaa';
    await this.db.furntitureAdd(beta, {labels:['victory_condition'], data:{location: 1, side:0, exit: 0},meta:{}});
    await this.db.furntitureAdd(beta, {labels:['victory_condition'], data:{location: 2, side:0, exit: 0},meta:{}});
    const last = await this.db.furntitureLast(beta);
    expect(last?.data?.location).to.equal(2);
  });
});