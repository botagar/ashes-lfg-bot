import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Command } from ".";

const slashCommand = new SlashCommandBuilder()
  .setName("lfg")
  .setDescription("Hello World LFG!");

const execute = async (interaction: CommandInteraction) => {
  await interaction.reply(
    `Hello World LFG! ${interaction.user.tag} is looking for a group!`
  );
};

export default { data: slashCommand, execute } as Command;
