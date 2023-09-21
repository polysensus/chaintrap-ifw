import { expect } from "chai";

import { TrialContent, Stores as TrialStores } from "./trialcontent.js";
import maps02 from "../../../static/content/maps/map02.json" assert { type: "json" };
import maps01 from "../../../static/content/maps/map01-model-two-rooms.json" assert { type: "json" };
import map02codex from "../../../static/content/maps/map02.codex.json" assert { type: "json" };

describe("idb trialcontent tests", async function () {
  it("Should create a new database", async function () {
    const db = new TrialContent({name:'trial'});
    await db.create();
    expect(db.db).to.exist;
  });
  it("Should save a map", async function () {
    const db = new TrialContent();
    await db.create();
    expect(db.db).to.exist;
    await db.addMap(maps02['map02']);
    const map = await db.mapByBeta(maps02['map02'].vrf_inputs.proof.beta);
    expect(map).to.exist;
  });

  it("Should save a codex", async function () {
    const db = new TrialContent();
    await db.create();
    expect(db.db).to.exist;
    await db.addCodex(map02codex);
    const count = await db.count(TrialStores.Codices)
    expect(count).to.equal(1);
  });

  it("Should count 1 map", async function () {
    const db = new TrialContent();
    await db.create();
    expect(db.db).to.exist;
    await db.addMap(maps02['map02']);
    const count = await db.count(TrialStores.Maps)
    expect(count).to.equal(1);
  });
  it("Should get last of two maps", async function () {
    const db = new TrialContent();
    await db.create();
    expect(db.db).to.exist;
    await db.addMap(maps02['map02']);
    await db.addMap(maps01['map01']);
    const count = await db.count(TrialStores.Maps)
    expect(count).to.equal(2);
    const map = await db.lastMap();
    expect(map.vrf_inputs.proof.beta).to.equal('aaaaaaaa');
  });

});