import { CommandInteraction } from "discord.js";
import { GenerateLFGHelpEmbed, GenerateLFMHelpEmbed } from "../embeds/help";

const LFMHelpFlow = async (interaction: CommandInteraction) => {
  const lfgHelpEmbed = GenerateLFGHelpEmbed();
  const lfmHelpEmbed = GenerateLFMHelpEmbed();
  return await interaction.reply({
    embeds: [lfgHelpEmbed, lfmHelpEmbed],
    ephemeral: true,
  });
};

export default LFMHelpFlow;
