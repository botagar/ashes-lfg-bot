import {
  SlashCommandBuilder,
  CommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonInteraction,
  ChannelType,
} from "discord.js";
import { Command } from ".";
import Player from "../models/player";
import PlayerLevelRange from "../models/playerLevelRange";
import PlayerClassSelector from "../models/playerClassSelector";
import Groups from "../group/groups";
import { Activities } from "../enums/activities";

const slashCommand = new SlashCommandBuilder()
  .setName("lfg")
  .setDescription("Register to look for a group.")
  .addStringOption((option) =>
    option
      .setName("class")
      .setDescription("Your current class.")
      .setRequired(true)
      .addChoices(
        {
          name: "bard",
          value: "Bard",
        },
        {
          name: "cleric",
          value: "Cleric",
        },
        {
          name: "fighter",
          value: "Fighter",
        },
        {
          name: "mage",
          value: "Mage",
        },
        {
          name: "ranger",
          value: "Ranger",
        },
        {
          name: "tank",
          value: "Tank",
        }
      )
  )
  .addNumberOption((option) =>
    option
      .setName("level")
      .setDescription("Your current level.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("activity")
      .setDescription("The Activity you want to do.")
      .setRequired(true)
      .addChoices(
        {
          name: "EXPFarming",
          value: "EXP Farming",
        },
        {
          name: "GearFarming",
          value: "Gear Farming",
        },
        {
          name: "EXPGearFarming",
          value: "EXP/Gear Farming",
        },
        {
          name: "raiding",
          value: "Raiding",
        },
        {
          name: "PvP",
          value: "PvP",
        },
        {
          name: "Questing",
          value: "Questing",
        }
      )
  );

const execute = async (interaction: CommandInteraction) => {
  const guildId = interaction.guildId;
  if (!guildId) {
    await interaction.reply({
      content: "Error: Unable to associate Guild.",
      ephemeral: true,
    });
    return;
  }

  const user = interaction.user;
  const playerClassInput = interaction.options.get("class");
  const playerClass = PlayerClassSelector.getClassByName(
    playerClassInput?.value
  );
  if (!playerClass) {
    await interaction.reply({
      content: "Error: Invalid class selected.",
      ephemeral: true,
    });
    return;
  }

  const playerLevelInput = interaction.options.get("level");
  const playerLevelRange = new PlayerLevelRange(
    playerLevelInput?.value as string
  );
  if (!playerLevelRange.isValid()) {
    await interaction.reply({
      content: "Error: Invalid level format.",
      ephemeral: true,
    });
    return;
  }
  const playerLevel = playerLevelRange.level;

  const activityInput = interaction.options.get("activity");
  if (!activityInput) {
    await interaction.reply({
      content: "Error: Invalid activity selected.",
      ephemeral: true,
    });
    return;
  }
  const activity = activityInput.value as Activities;

  const player: Player = new Player(
    user.id,
    user.tag,
    playerClass,
    playerLevel,
    guildId
  );
  await interaction.reply({
    content: `Searching for a group for [${player.name}] as a level [${player.level}] [${player.playerClass}] for [${activityInput?.value}]`,
    ephemeral: true,
  });
  const openGroup = Groups.getInstance().findOpenGroup(
    guildId,
    activity,
    player
  );
  console.log(openGroup);
  if (openGroup) {
    // openGroup.addPlayer(player);
    await interaction.followUp({
      content: `A group has been found! Please join the channel which you've been pinged in.`,
      ephemeral: true,
    });
    // TODO: Ping Player in Voice Channel
    return;
  }

  const yesButton = new ButtonBuilder()
    .setCustomId("createGroupYes")
    .setLabel("Create new Group")
    .setStyle(ButtonStyle.Success);
  const noButton = new ButtonBuilder()
    .setCustomId("createGroupNo")
    .setLabel("Wait for Existing Group")
    .setStyle(ButtonStyle.Secondary);
  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    yesButton,
    noButton
  );
  const response = await interaction.followUp({
    content: `No Open Group Found. Would you like to start a new group?`,
    ephemeral: true,
    components: [buttonRow],
  });

  const collectorFilter: any = (i: ButtonInteraction) => {
    return i.user.id === interaction.user.id;
  };

  try {
    const confirmation = await response.awaitMessageComponent({
      filter: collectorFilter,
      time: 60_000,
    });
    await confirmation.deferUpdate();
    if (confirmation.customId === "createGroupYes") {
      const ashesVoiceCategory = interaction.guild?.channels.cache
        .filter((c) => c.type === ChannelType.GuildCategory)
        .filter((c) => c.name.toLowerCase().startsWith("aoc"));
      const ashesVoiceChannels = interaction.guild?.channels.cache.filter(
        (c) =>
          c.type === ChannelType.GuildVoice &&
          c.parent === ashesVoiceCategory?.values().next().value
      );
      console.log(ashesVoiceChannels);
      const newGroupChannel = await interaction.guild?.channels.create({
        name: `LFM ${activity}`,
        type: ChannelType.GuildVoice,
        parent: ashesVoiceCategory?.values().next().value,
      });
      if (!newGroupChannel) {
        await interaction.followUp({
          content:
            "Error: Unable to create new channel. Please alert the #guild-development channel to this error.",
          ephemeral: true,
        });
        return;
      }
      Groups.getInstance().createGroup(
        guildId,
        newGroupChannel.id,
        user.id,
        activity
      );
      await newGroupChannel?.send(
        `${interaction.user} has created a group for ${activity}. Join the voice channel to participate!`
      );
      await newGroupChannel?.send(
        `Use the /lfm command to configure your group.`
      );

      await confirmation.editReply({
        content: `A new group has been created! Please join the channel which you've been mentioned in.`,
        components: [],
      });
    } else if (confirmation.customId === "createGroupNo") {
      await confirmation.editReply({
        content: `No Worries! We'll ping you when a group is found.`,
        components: [],
      });
    }
  } catch (e) {
    console.error(e);
    await interaction.followUp({
      content: "Confirmation not received within 1 minute, cancelling",
      components: [],
      ephemeral: true,
    });
  }
};

export default { cooldown: 5, data: slashCommand, execute } as Command;
