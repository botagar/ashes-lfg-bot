import {
  ApplicationCommandOptionType,
  bold,
  CommandInteraction,
  inlineCode,
} from "discord.js";
import Groups from "../../group/groups";
import logger from "../../utils/logger";
import ValidateActivity from "../validators/validateActivity";

const LFMActivityFlow = async (interaction: CommandInteraction) => {
  const channel = interaction.channel;

  if (!channel || !channel.isVoiceBased()) {
    return interaction.reply({
      content: `Run this command in a voice channel associated with a group.`,
    });
  }

  const group = Groups.getInstance().findGroupByChannel(channel.id);
  if (!group) {
    return interaction.reply({
      content: `No group associated with this channel. Start a group with ${inlineCode(
        "/lfm open"
      )}.`,
    });
  }

  const subcommand = interaction.options.data[0];
  if (!subcommand) {
    return interaction.reply({
      content: `Subcommand is required.`,
    });
  }
  if (subcommand.type !== ApplicationCommandOptionType.Subcommand) {
    return interaction.reply({
      content: `Unexpected subcommand: ${subcommand.name}`,
    });
  }
  const { options } = subcommand;
  const activityInput = options?.find(
    (option) => option.name === "activity"
  )?.value;
  const activity = ValidateActivity(activityInput);
  logger.info({
    msg: "Setting group activity",
    group: group,
    activity,
  });
  group.setActivity(activity);

  return await interaction.reply({
    content: `Group activity has been set to ${bold(activity)}.`,
  });
};

export default LFMActivityFlow;
