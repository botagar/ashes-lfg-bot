import { CommandInteraction, CommandInteractionOption } from "discord.js";
import PlayerQueue from "../../queue/playerQueue";
import { GuildId } from "../../types";
import { ClassRoleFromString } from "../../enums/classTypes";

const LFMListFlow = async (
  interaction: CommandInteraction,
  subcommand: CommandInteractionOption,
  guildQueues: Map<GuildId, PlayerQueue>
) => {
  const { options } = subcommand;
  const guildId = interaction.guildId as GuildId;

  const role = options?.find((option) => option.name === "role")?.value;
  console.log(`Listing players in queue for role: ${role}`);
  if (!role) {
    return interaction.reply({
      content: `Role is required.`,
      ephemeral: true,
    });
  }

  if (!guildQueues.has(guildId)) {
    const queue = new PlayerQueue(guildId);
    guildQueues.set(guildId, queue);
    return await interaction.reply({
      content: `No players currently in queue.`,
      ephemeral: true,
    });
  } else {
    const queue = guildQueues.get(guildId);
    if (!queue) {
      return await interaction.reply({
        content: `Error: Unable to retrieve queue.`,
        ephemeral: true,
      });
    }
    const classRole = ClassRoleFromString(role as string);
    if (!classRole) {
      return await interaction.reply({
        content: `Invalid role: ${role}`,
        ephemeral: true,
      });
    }
    const players = queue.getPlayersInWaitForAsRole(classRole);
    if (players.length === 0) {
      return await interaction.reply({
        content: `No players currently in queue for ${role}.`,
        ephemeral: true,
      });
    }
    return await interaction.reply({
      content: `Players currently in queue for ${role}: ${players}`,
      ephemeral: true,
    });
  }
};

export default LFMListFlow;
