import { Events, Interaction, MessageFlags } from "discord.js";
import commandsCollection from "../commands";
import { DiscordUserEvent } from ".";

// TODO: Implement Cooldowns

const execute = async (interaction: Interaction) => {
  console.log((interaction as any).commandName);

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
};

export default {
  name: Events.InteractionCreate,
  once: false,
  execute,
} as DiscordUserEvent;
