import { CommandCompletions } from "./gamecompletions.js";
import { CodeMirrorCommandSet } from "./codemirror.js";

import { CreateGameCommandCtx } from '$lib/commandcontexts/creategame.js';
import { JoinGameCommandCtx } from '$lib/commandcontexts/joingame.js';
import { UseExitCommandCtx } from '$lib/commandcontexts/useexit.js';
import { OpenChestCommandCtx } from '$lib/commandcontexts/openchest.js';
import { SetStartCommandCtx } from '$lib/commandcontexts/setstart.js';
import { StartGameCommandCtx } from '$lib/commandcontexts/startgame.js';

/**
 * Create a command set for a dungeon builder 
 * @param {{fetch:Function}} options 
 */
export function createBuilderCommands(options) {

  if (!options.fetch)
    throw new Error('a fetch implementation is a required option');

  const commands = new CodeMirrorCommandSet();
  const cmd = new CreateGameCommandCtx({fetch});
  commands.append(
    CommandCompletions.get(CommandCompletions.create_game),
    cmd.exec.bind(cmd)
  )
  return commands;
}

export function createGuardianCommands({gid}) {
  const commands = new CodeMirrorCommandSet();

  let cmd = undefined;

  cmd = new SetStartCommandCtx({gid});
  commands.append(
    CommandCompletions.get(CommandCompletions.set_start_for_player),
     cmd.exec.bind(cmd)
  );

  cmd = new StartGameCommandCtx(cmd, {gid});
  commands.append(
    CommandCompletions.get(CommandCompletions.start_game),
    cmd.exec.bind(cmd)
  );

  return commands;
}

export function createTrialistCommands({gid}) {
  const commands = new CodeMirrorCommandSet();

  let cmd;
  cmd = new JoinGameCommandCtx({gid});
  commands.append(
    CommandCompletions.get(CommandCompletions.join_game),
    cmd.exec.bind(cmd)
  );

  // use exit
  cmd = new UseExitCommandCtx({gid})
  commands.append(
    CommandCompletions.get(CommandCompletions.use_exit),
    cmd.exec.bind(cmd)
  );


  // open chest
  cmd = new OpenChestCommandCtx({gid})
  commands.append(
    CommandCompletions.get(CommandCompletions.open_chest),
    cmd.exec.bind(cmd)
  );

  // use victory exit
  return commands;

}
