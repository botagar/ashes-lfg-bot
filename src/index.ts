import "dotenv/config";
import {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  MessageFlags,
} from "discord.js";
import { commands, Command } from "./commands";
import { deployCommands } from "./deploy-commands";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

const commandsCollection = new Collection<string, Command>();
for (const commandName of Object.keys(commands)) {
  commandsCollection.set(
    commandName,
    commands[commandName as keyof typeof commands]
  );
}

client.on(Events.InteractionCreate, async (interaction) => {
  console.log(interaction);

  if (!interaction.isChatInputCommand()) return;

  const command = commandsCollection.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

(async () => {
  console.log("Deploying commands...");
  if (process.env) {
    console.log(
      Object.keys(process.env)
        .filter((key) => key.startsWith("DISCORD"))
        .reduce((envVars, key) => {
          envVars[key] = process.env[key];
          return envVars;
        }, {} as Record<string, string | undefined>)
    );
  }
  await deployCommands({ guildId: process.env.DISCORD_DEV_SERVER_ID! });
})();
