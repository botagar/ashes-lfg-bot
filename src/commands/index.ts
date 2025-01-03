import { Collection } from "discord.js";
import lfg from "./lfg";
import lfm from "./lfm";

export type Command = {
  cooldown?: number;
  data: any;
  execute: (interaction: any) => Promise<void>;
};

const commands = {
  lfg,
  lfm,
};

const commandsCollection = new Collection<string, Command>();
for (const commandName of Object.keys(commands)) {
  commandsCollection.set(
    commandName,
    commands[commandName as keyof typeof commands]
  );
}

export default commandsCollection;
export { commands };
