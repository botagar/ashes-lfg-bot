import {
  SlashCommandBuilder,
  CommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonInteraction,
  ChannelType,
  Collection,
  GuildMember,
} from "discord.js";
import { Command } from ".";
import Player from "../models/player";
import PlayerLevelRange from "../models/playerLevelRange";
import PlayerClassSelector from "../models/playerClassSelector";
import Groups from "../group/groups";
import { Activities } from "../enums/activities";
import guildQueues from "../queue/guildQueues";
import PlayerQueue from "../queue/playerQueue";
import logger from "../utils/logger";
import { GenerateLFMHelpEmbed } from "./embeds/help";

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
    content: `Searching for a group for [${player.name}] as a level [${player.level}] [${player.playerClass.name}] for [${activityInput?.value}]`,
    ephemeral: true,
  });
  const openGroup = Groups.getInstance().findOpenGroup(
    guildId,
    activity,
    player
  );
  console.log(openGroup);
  if (openGroup) {
    await interaction.followUp({
      content: `A group has been found! Please join the channel which you've been mentioned in.`,
      ephemeral: true,
    });
    const voiceChannelId = openGroup.channelId;
    const voiceChannel = interaction.guild?.channels.cache.get(voiceChannelId);
    const userAlreadyInChannel = (
      voiceChannel?.members as Collection<string, GuildMember>
    ).has(user.id);
    console.log(userAlreadyInChannel);
    if (userAlreadyInChannel) {
      openGroup.acceptInvite(player.id);
      return await interaction.followUp({
        content: `${interaction.user} has joined the group.`,
      });
    }
    if (voiceChannel && voiceChannel.type === ChannelType.GuildVoice) {
      openGroup.invitePlayer(player);
      await voiceChannel.send(
        `${interaction.user} Please join this voice channel to join the group.`
      );
    }
    return;
  }

  const yesButton = new ButtonBuilder()
    .setCustomId("createGroupYes")
    .setLabel("Create new Group")
    .setStyle(ButtonStyle.Success);
  const noButton = new ButtonBuilder()
    .setCustomId("createGroupNo")
    .setLabel("Wait in Queue")
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
      const lfmHelpEmbed = GenerateLFMHelpEmbed();
      await newGroupChannel?.send({
        embeds: [lfmHelpEmbed],
      });
      await newGroupChannel?.send(
        `${interaction.user} has created a group for ${activity}. Join the voice channel to participate!`
      );
      await confirmation.editReply({
        content: `A new group has been created! Please join the channel which you've been mentioned in.`,
        components: [],
      });
    } else if (confirmation.customId === "createGroupNo") {
      let queue = guildQueues.get(guildId);
      logger.info({
        msg: "Adding player to queue",
        player: player,
        activity: activity,
      });
      logger.debug({
        msg: "Guild Queues",
        queues: guildQueues,
      });
      if (!queue) {
        queue = new PlayerQueue(guildId);
        logger.info({
          msg: "New Queue Created",
          queue: queue,
        });
        queue.add(player, [activity]);
        guildQueues.set(guildId, queue);
        console.debug(guildQueues);
        logger.debug({
          msg: "Guild Queues",
          queues: Object.keys(guildQueues),
        });
      }
      queue.add(player, [activity]);
      await confirmation.editReply({
        content: `No Worries! We'll ping you when a slot opens up for you.`,
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
