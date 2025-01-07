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
  let channelGroup = Groups.getInstance().findGroupByChannel(voiceChannel.id);
  if (!channelGroup) {
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
      console.log(`CID[] creating group with activity: ${activity}`);

      const ownerId = interaction.user.id;
      channelGroup = Groups.getInstance().createGroup(
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
      console.log(
        `CID[${channelGroup.channelId}] ${interaction.user.displayName} created a new group with activity ${activity}`
      );
    } catch (e) {
      console.error(e);
      await interaction.editReply({
        content: "Activity selection timed out.",
        components: [],
      });
    }
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
  const classRole = ClassRoleFromString(selectedRole as string);
  const levelRange = new PlayerLevelRange(levelRangeInput as string);
  if (!classRole || !levelRange.isValid() || !slotCount) {
    const responseMethod = isNewGroup ? "followUp" : "reply";
    return await interaction[responseMethod]({
      content: `Invalid slot configuration.`,
      ephemeral: true,
    });
  }

  console.log(
    `CID[${channelGroup?.channelId}] ${interaction.user.displayName} is opening ${slotCount} slot(s) for ${classRole} with level range ${levelRange.min}-${levelRange.max}`
  );
  const slot = {
    classTypes: [classRole],
    levelRange: { min: levelRange.min, max: levelRange.max },
  };
  for (let i = 0; i < slotCount; i++) {
    channelGroup!.openSlot(slot);
  }

  const confirmationMessage = `Slot opened for ${slotCount} ${classRole} with level range ${levelRange.min}-${levelRange.max}`;
  console.log(`CID[${channelGroup?.channelId}] ${confirmationMessage}`);

  const responseMethod = isNewGroup ? "followUp" : "reply";
  await interaction[responseMethod]({
    content: confirmationMessage,
    ephemeral: true,
  });
};

export default LFMOpenFlow;
