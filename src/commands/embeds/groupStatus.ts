import { APIEmbed, APIEmbedField } from "discord.js";
import Group from "../../group/group";
import { Time } from "../../utils/time";

const GenerateGroupStatusEmbed = (group: Group): APIEmbed => {
  const groupActivity: APIEmbedField = {
    name: "Current Activity",
    value: group.activities.join(", "),
  };

  const pendingInvites: APIEmbedField = {
    name: `✉️ Pending Invites: ${group.pendingInvites.length}`,
    value: group.pendingInvites.reduce((acc, invite, index) => {
      const inviteDuration = Date.now() - invite.invitedAt.getTime();
      return `${acc}\n${index}) ${
        invite.player.name
      } as ${invite.slot.classTypes.join(", ")} (lvl ${
        invite.slot.levelRange.min
      }-${invite.slot.levelRange.max}) ⏲️(${Time.millisecondsToHumanReadable(
        inviteDuration
      )})`;
    }, ""),
  };

  const openSlots: APIEmbedField = {
    name: `🔍 Number of Open Slots: ${group.openSlots.length}`,
    value: group.openSlots.reduce((acc, slot, index) => {
      const role = slot.classTypes.join(", ");
      const levelRange = `${slot.levelRange.min}-${slot.levelRange.max}`;
      const newEntry = `${index}) ${role} Level: ${levelRange}`;
      return acc.length + newEntry.length + 1 <= 1024
        ? `${acc}\n${newEntry}`
        : acc;
    }, ""),
  };

  const embed: APIEmbed = {
    color: 0x0099ff,
    title: "Group Status",
    description: `Status of group associated with this channel.`,
    fields: [groupActivity, pendingInvites, openSlots],
    timestamp: new Date().toISOString(),
  };

  return embed;
};

export default GenerateGroupStatusEmbed;
