import { CommandInteraction } from "discord.js";
import Groups from "../../group/groups";

const LFMCloseFlow = async (interaction: CommandInteraction) => {
  const channel = interaction.channel;

  if (!channel || !channel.isVoiceBased()) {
    return interaction.reply({
      content: `Run this command in a voice channel associated with a group.`,
    });
  }

  const group = Groups.getInstance().findGroupByChannel(channel.id);
  if (!group) {
    return interaction.reply({
      content: `No group associated with this channel. Nothing to close.`,
    });
  }

  Groups.getInstance().deleteGroup(group.guildId, group.channelId);

  return await interaction.reply({
    content: `Group has been closed.`,
  });
};

export default LFMCloseFlow;
