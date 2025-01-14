import { APIEmbed, CommandInteraction, inlineCode } from "discord.js";
import { GuildId } from "../../types";
import Groups from "../../group/groups";
import GenerateGroupStatusEmbed from "../embeds/groupStatus";

const LFMStatusFlow = async (interaction: CommandInteraction) => {
  const guildId = interaction.guildId as GuildId;
  const channel = interaction.channel;

  if (!channel || !channel.isVoiceBased()) {
    return interaction.reply({
      content: `Run this command in a voice channel associated with a group.`,
    });
  }

  const group = Groups.getInstance().findGroupByChannel(channel.id);
  if (!group) {
    return interaction.reply({
      content: `No group associated with this channel. Use ${inlineCode(
        "/lfm open"
      )} to create a group.`,
    });
  }

  const embed: APIEmbed = GenerateGroupStatusEmbed(group);

  return await interaction.reply({ embeds: [embed] });
};

export default LFMStatusFlow;
