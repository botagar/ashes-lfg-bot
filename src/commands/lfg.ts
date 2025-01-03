import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Command } from ".";

const slashCommand = new SlashCommandBuilder()
  .setName("lfg")
  .setDescription("Hello World LFG!");

const execute = async (interaction: CommandInteraction) => {
  await interaction.reply({
    content: `Hello World LFG! ${interaction.user.tag} is looking for a group!`,
    ephemeral: true,
  });
  await interaction.followUp({
    content: `You have a group!`,
    ephemeral: true,
  });
};

export default { cooldown: 5, data: slashCommand, execute } as Command;
