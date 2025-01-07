import { CommandInteraction } from "discord.js";

const LFMHelpFlow = async (interaction: CommandInteraction) => {
  return await interaction.reply({
    content: `LFM Help`,
    ephemeral: true,
  });
};

export default LFMHelpFlow;
