import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Command } from ".";

const slashCommand = new SlashCommandBuilder()
  .setName("lfm")
  .setDescription("Hello World LFM!");

const execute = async (interaction: CommandInteraction) => {
  await interaction.reply(
    `Hello World LFM! ${interaction.user.tag} is looking for more!`
  );
};

export default { data: slashCommand, execute } as Command;
