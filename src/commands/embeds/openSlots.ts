import { APIEmbed } from "discord.js";
import Group from "../../group/group";

const OpenSlotsEmbed = (group: Group): APIEmbed => {
  return {
    color: 0xff0000,
    title: "Open Slots",
    description: `There are ${group.openSlots.length} open slots in the group.\nThis feature is still WIP.`,
    fields: [
      {
        name: "Group Members",
        value: group.openSlots
          .map(
            (slot, index) =>
              `${index}> ${slot.classTypes.join(",")} lvl: ${
                slot.levelRange.min
              }-${slot.levelRange.max}`
          )
          .join("\n"),
      },
    ],
    timestamp: new Date().toISOString(),
  };
};

export default OpenSlotsEmbed;
