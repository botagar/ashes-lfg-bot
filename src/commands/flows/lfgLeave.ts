import { CommandInteraction } from "discord.js";
import guildQueues from "../../queue/guildQueues";

const LFGLeaveFlow = async (interaction: CommandInteraction) => {
  const { user, guild } = interaction;

  if (!guild) {
    return await interaction.reply({
      content: "Error: Unable to associate Guild.",
      ephemeral: true,
    });
  }

  const guildQueue = guildQueues.get(guild.id);
  if (!guildQueue) {
    return await interaction.reply({
      content: "Queue was empty. Nothing to do.",
      ephemeral: true,
    });
  }

  const player = guildQueue.removePlayer(user.id);
  if (!player) {
    return await interaction.reply({
      content: "Player not found in queue. Nothing to do.",
      ephemeral: true,
    });
  }
  interaction.reply({
    content: `You have left the queue.`,
    ephemeral: true,
  });
};

export default LFGLeaveFlow;
