import {
  ActionRowBuilder,
  CommandInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import Groups from "../../group/groups";
import { GuildId } from "../../types";
import { Activities } from "../../enums/activities";
import { ClassRoleFromString } from "../../enums/classTypes";
import PlayerLevelRange from "../../models/playerLevelRange";
import guildQueues from "../../queue/guildQueues";
import logger from "../../utils/logger";

const DEFAULT_INVITE_TIMEOUT_m = 5;

const LFMOpenFlow = async (interaction: CommandInteraction) => {
  const guildId = interaction.guildId as GuildId;
  const isVoiceChannel = interaction.channel?.isVoiceBased();
  if (!isVoiceChannel) {
    return await interaction.reply({
      content: `Please run this command from a voice channel which you are in.`,
      ephemeral: true,
    });
  }
  let isNewGroup = false;
  const voiceChannel = interaction.channel;
  let group = Groups.getInstance().findGroupByChannel(voiceChannel.id);
  if (!group) {
    const activitySelect = new StringSelectMenuBuilder()
      .setCustomId("activity")
      .setPlaceholder("Select group activity")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("EXPFarming")
          .setDescription("EXP focused farming.")
          .setValue("EXP Farming"),
        new StringSelectMenuOptionBuilder()
          .setLabel("GearFarming")
          .setDescription("Gear focused farming.")
          .setValue("Gear Farming"),
        new StringSelectMenuOptionBuilder()
          .setLabel("EXPGearFarming")
          .setDescription("Balance of EXP and Gear farming.")
          .setValue("EXP/Gear Farming"),
        new StringSelectMenuOptionBuilder()
          .setLabel("PvP")
          .setDescription("Gang up for PvP!")
          .setValue("PvP"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Raiding")
          .setDescription("Dungeon raiding and other large group activities.")
          .setValue("Raiding"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Questing")
          .setDescription("Travel the world and complete quests.")
          .setValue("Questing"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Gathering")
          .setDescription("Travel the world and gather materials.")
          .setValue("Gathering"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Caravan")
          .setDescription("Let's make money caravaning.")
          .setValue("Caravan"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Other")
          .setDescription("Other activities not listed.")
          .setValue("Other")
      );
    const activitySelectRow =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        activitySelect
      );
    const activityPrompt = await interaction.reply({
      content: `Please provide the activity you are looking for.`,
      ephemeral: true,
      components: [activitySelectRow],
    });

    const collectorFilter = (i: any) => i.user.id === interaction.user.id;
    try {
      const activityResponse = (await activityPrompt.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      })) as StringSelectMenuInteraction;
      if (activityResponse.customId !== "activity") {
        return await interaction.editReply({
          content: "Invalid activity selection.",
          components: [],
        });
      }

      const activity = activityResponse.values[0] as Activities;
      logger.info({
        msg: "Creating group",
        activity: activity,
        channel: voiceChannel.id,
      });

      const ownerId = interaction.user.id;
      group = Groups.getInstance().createGroup(
        guildId,
        voiceChannel.id,
        ownerId,
        activity
      );

      await activityResponse.update({
        content: `Group activity set to [${activity}]`,
        components: [],
      });
      isNewGroup = true;
      logger.info({
        msg: "Group created",
        owner: interaction.user.displayName,
        activity: activity,
        channel: voiceChannel.id,
      });
    } catch (e) {
      logger.error(e);
      await interaction.editReply({
        content: "Activity selection timed out.",
        components: [],
      });
    }
  }

  if (!group) {
    return await interaction.reply({
      content: `Error: Unable to create group.`,
      ephemeral: true,
    });
  }

  const slotInputs = interaction.options.data[0]?.options;
  const selectedRole = slotInputs?.find(
    (si) => si.type === 3 && si.name === "role"
  )?.value;
  const levelRangeInput = slotInputs?.find(
    (si) => si.type === 3 && si.name === "level"
  )?.value;
  const slotCount = slotInputs?.find(
    (si) => si.type === 10 && si.name === "count"
  )?.value as number;
  const inviteTimeoutOption = slotInputs?.find(
    (si) => si.type === 4 && si.name === "invite-timeout"
  );
  const inviteTimeout_m: number =
    inviteTimeoutOption !== undefined
      ? (inviteTimeoutOption.value as number)
      : DEFAULT_INVITE_TIMEOUT_m;
  const classRole = ClassRoleFromString(selectedRole as string);
  const levelRange = new PlayerLevelRange(levelRangeInput as string);
  if (!classRole || !levelRange.isValid() || !slotCount) {
    const responseMethod = isNewGroup ? "followUp" : "reply";
    return await interaction[responseMethod]({
      content: `Invalid slot configuration.`,
      ephemeral: true,
    });
  }

  logger.info({
    msg: "Opening slot(s)",
    group: group.channelId,
    owner: interaction.user.displayName,
    classRole: classRole,
    levelRange: levelRange,
    slotCount: slotCount,
  });
  const queue = guildQueues.get(guildId);
  const slot = {
    classTypes: [classRole],
    levelRange: { min: levelRange.min, max: levelRange.max },
    inviteTimeout_ms: inviteTimeout_m * 60 * 1000,
  };
  const groupChannel = interaction.guild?.channels.cache.get(group.channelId);
  for (let i = 0; i < slotCount; i++) {
    group.openSlot(slot);
    if (queue) {
      const player = queue.getNextPlayer(
        group!.activities as Activities[],
        classRole
      );
      if (player) {
        group.invitePlayer(player);
        const user = interaction.guild?.members.cache.get(player.id);
        if (groupChannel && groupChannel.isVoiceBased()) {
          groupChannel?.send(
            `${user} has been invited to the group as a ${classRole}`
          );
        }
      }
    }
  }

  logger.info({
    msg: "Slot opened",
    group: group.channelId,
    owner: interaction.user.displayName,
    classRole: classRole,
    levelRange: levelRange,
    slotCount: slotCount,
  });

  const responseMethod = isNewGroup ? "followUp" : "reply";
  logger.debug({
    msg: "interaction replied?",
    method: responseMethod,
    replied: interaction.replied,
  });
  await interaction[responseMethod]({
    content: `Slot opened for ${slotCount} ${classRole} with level range ${levelRange}`,
    ephemeral: true,
  });
};

export default LFMOpenFlow;
