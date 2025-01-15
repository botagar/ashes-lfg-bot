import { CommandInteraction } from "discord.js";
import { GenerateLFGHelpEmbed } from "../embeds/help";

const LFGHelpFlow = async (interaction: CommandInteraction) => {
  const lfgHelpEmbed = GenerateLFGHelpEmbed();
  return await interaction.reply({
    embeds: [lfgHelpEmbed],
    ephemeral: true,
  });
};

export default LFGHelpFlow;
