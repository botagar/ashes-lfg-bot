import { APIEmbed, APIEmbedField } from "discord.js";
import Group from "../../group/group";

const GenerateGroupStatusEmbed = (group: Group): APIEmbed => {
  const pendingInvites: APIEmbedField = {
    name: `Pending Invites: ${group.pendingInvites.length}`,
    value: group.pendingInvites.reduce((acc, invite) => {
      return `${acc}\n${invite.player.name} as ${invite.slot.classTypes.join(
        ", "
      )}`;
    }, ""),
  };

  const openSlots: APIEmbedField = {
    name: `Number of Open Slots: ${group.openSlots.length}`,
    value: group.openSlots.reduce((acc, slot) => {
      const role = slot.classTypes.join(", ");
      const levelRange = `${slot.levelRange.min}-${slot.levelRange.max}`;
      return `${acc}\n${role} Level: ${levelRange}`;
    }, ""),
  };

  const embed: APIEmbed = {
    color: 0x0099ff,
    title: "Group Status",
    description: `Status of group associated with this channel.`,
    fields: [pendingInvites, openSlots],
    timestamp: new Date().toISOString(),
  };

  return embed;
};

export default GenerateGroupStatusEmbed;
