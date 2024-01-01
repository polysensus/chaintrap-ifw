
import {LocationChoiceType} from '@polysensus/chaintrap-arenastate';
/**
 * @param location {number}
 * @param choices {Array.<Array<number>>}
 * @param options {{useExitCmd:object,openChestCmd:object}}
 * 
 * @typedef {{
 *  id:number,choiceType:number,
 *  side?:number,sideName?:string,exit?:number,
 *  chestNumber?:number,
 *  commandPrefix:string,prompt:string,naturalPrompt:string[],
 *  execArgs:Array<Object>,exec:Function
 * }} MenuEntry
 * 
 * @returns {{
 *   choiceMenu: Array.<MenuEntry>,
 *   locationSummary: string[],
 *   exitsSummary: string[],
 *   chestsSummary: string[],
 *   openableChestCount: number,
 *   sidesWithExitsCount: number,
 *   exitCount: number,
 *   sideExitCount: Object.<number,number>,
 *   sidesWithMultipleExitsCount: number,
 * }}
 */
export function describeChoices(location, choices, inputChoice, options={}) {

  const {
    useExitCmd, openChestCmd
  } = options;

  /** @type {MenuEntry[]}*/
  let choiceMenu = [];
  let sidesWithExitsCount = 0;
  let sidesWithExits = [];
  let sideNamesWithExits = [];
  let openableChestCount = 0;
  let exitCount = 0;
  let sidesWithMultipleExitsCount = 0;
  /** @type Object.<string,number>*/
  let sideExitCount = {};
  let locationSummary = [`You are at location ${location}`, `Location ${location}`];
  let exitsSummary = ["", ""];
  let chestsSummary = ["", ""];

  if (!choices)
    return {
      locationSummary,
      exitsSummary,
      chestsSummary,
      choiceMenu,
      openableChestCount,
      sidesWithExitsCount,
      exitCount,
      sideExitCount,
      sidesWithMultipleExitsCount,
    }


  for (let i=0; i < choices?.length; i++) {
    const choiceType = choices[i][0];
    if (choiceType <= LocationChoiceType.LastSideChoice) {
      const sideName = {0: "north", 1: "west", 2: "south", 3: "east"}[choiceType];

      exitCount += 1;
      const n = Number(sideExitCount[choiceType] ?? 0) + 1;
      sideExitCount[choiceType] =  n;
      if (n === 1) {
        sidesWithExitsCount += 1;
        sidesWithExits.push(choiceType);
        sideNamesWithExits.push(sideName);
      }

      const cm = {
        id: choiceMenu.length,
        choiceType,
        side: choiceType,
        sideName,
        exit: choices[i][1],
        commandPrefix: "use exit",
        prompt: `use exit {${choices[i][1]}} on {${sideName}}`,
        naturalPrompt: ["use the exit", "used the exit"]
      };
      if (useExitCmd) {
        cm.execArgs = [{values:{side:choiceType, exitNumber:choices[i][1]}}];
        cm.exec = useExitCmd.exec.bind(useExitCmd);
      }

      choiceMenu.push(cm);

      continue;
    }
    switch (choiceType) {
      case LocationChoiceType.OpenChest: {
        openableChestCount ++;
        // const chestNumber = choices[i][1] - LocationChoiceType.OpenChest;
        const chestNumber = choices[i][1];
        const cm = {
          id: choiceMenu.length,
          choiceType,
          chestNumber: choices[i][1],
          commandPrefix: "open chest",
          prompt: `open chest {${chestNumber}}`,
          naturalPrompt: ['open the chest', 'opened the chest'],
        }
        if (openChestCmd) {
          cm.execArgs = [{values:{number:chestNumber}}];
          cm.exec = openChestCmd.exec.bind(openChestCmd);
        }
        choiceMenu.push(cm);
      }
    }
  }
  for (let i=0; i <= LocationChoiceType.LastSideChoice; i++)
    if (Number(sideExitCount[i] ?? 0) > 1) {
      sidesWithMultipleExitsCount ++;
      break
    }

  for (let i=0; i < choiceMenu.length; i ++) {
    const cm = choiceMenu[i];
    if (cm.choiceType <= LocationChoiceType.LastSideChoice) {
      // If there are no sides with multiple exist use the simplest language possible
      if (sidesWithMultipleExitsCount === 0 || sideExitCount[cm.choiceType] === 1) {
        cm.naturalPrompt = [`Leave by the ${cm.sideName} exit`,
          `You left by the ${cm.sideName} exit`];
        continue;
      }
      if (sideExitCount[cm.choiceType] > 1) {

        let instance = {0: "first", 1: "second", 2: "third"}[cm.exit];
        if (instance) {
          cm.naturalPrompt = [
            `Leave by the first exit on the ${cm.sideName}`,
            `You left by the first exit on the ${cm.sideName}`];
        }
        else {
          cm.naturalPrompt = [
            `Leave by exit ${cm.exit} on the ${cm.sideName}`,
            `You left by exit ${cm.exit} on the ${cm.sideName} side`];
        }
        continue;
      }
    }
    if (choiceMenu[i].choiceType != LocationChoiceType.OpenChest) {
      console.log(JSON.stringify(choiceMenu[i]));
      throw new Error(`choice menu preparation failed: ${choiceMenu[i].choiceType} ${typeof choiceMenu[i].choiceType}`);
    }
    if (openableChestCount === 1) {
      // if there is only a single chest, use the simplest language
      cm.naturalPrompt = ['Open the chest', 'You opened a chest'];
      continue;
    }
    let instance = {0: "first", 1: "second", 2: "third"}[cm.chestNumber];
    if (instance) {
      cm.naturalPrompt = [`Open the ${instance} chest`, `You opened the ${instance} chest`];
    }
    else {
      cm.naturalPrompt = [`Open chest ${cm.chestNumber}`, `You opened chest ${instance}`];
    }
  }

  switch (sidesWithExits.length) {
    case 0: {
      exitsSummary = ["There is no visible way out"];
      break;
    }
    case 1: {
      if (sidesWithMultipleExitsCount === 0) 
        exitsSummary = [
          `There is a single exit to the ${sideNamesWithExits[0]}`,
          `There was a single exit to the ${sideNamesWithExits[0]}`];
      else
        exitsSummary = [
          `There are ${sidesWithMultipleExitsCount} exits on the ${sideNamesWithExits[0]} side`,
          `There were ${sidesWithMultipleExitsCount} exits on the ${sideNamesWithExits[0]} side`];
      break;
    }
    case 2: {
      exitsSummary = [
        `There are exits to the ${sideNamesWithExits[0]} and ${sideNamesWithExits[1]}`,
        `There were exits to the ${sideNamesWithExits[0]} and ${sideNamesWithExits[1]}`,
      ];
      break;
    }
    case 3: {
      exitsSummary = [
        `There are exits to the ${sideNamesWithExits[0]}, ${sideNamesWithExits[1]} and ${sideNamesWithExits[2]}`,
        `There were exits to the ${sideNamesWithExits[0]}, ${sideNamesWithExits[1]} and ${sideNamesWithExits[2]}`,
      ];
      break;
    }
    default: {
      exitsSummary = [
        'There are many exits to chose from',
        'There were many exits to chose from'
      ]
      break;
    }
  }

  switch (openableChestCount) {
    case 0: {
      chestsSummary = ["You see nothing of particular interest", "You saw nothing of particular interest"];
      break;
    }
    case 1: {
      chestsSummary = ["There is an un opened chest on the floor", "There was an un opened chest on the floor"];
      break;
    }
    case 2: {
      chestsSummary = [
        "You see a pair of un opened chests on the floor",
        "You saw a pair of un opened chests on the floor"];
    }
    case 3: {
      chestsSummary = [
        "There is a clutter of un opened chests on the floor",
        "There was a clutter of un opened chests on the floor"
      ];
    }
  }

  return {
    locationSummary,
    exitsSummary,
    chestsSummary,
    choiceMenu,
    openableChestCount,
    sidesWithExitsCount,
    exitCount,
    sideExitCount,
    sidesWithMultipleExitsCount,
  }
}