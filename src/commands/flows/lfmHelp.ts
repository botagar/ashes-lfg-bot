import { CommandInteraction } from "discord.js";
import { GenerateLFMHelpEmbed } from "../embeds/help";

const LFMHelpFlow = async (interaction: CommandInteraction) => {
  const lfmHelpEmbed = GenerateLFMHelpEmbed();
  return await interaction.reply({
    embeds: [lfmHelpEmbed],
    ephemeral: true,
  });
};

export default LFMHelpFlow;
