import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Command } from ".";
import Player from "../models/player";
import { ClassNames } from "../enums/classNames";
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
        },
        {
          name: "GearFarming",
          value: "Gear Farming",
        }
      )
  );

const execute = async (interaction: CommandInteraction) => {
  console.log(interaction);
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
      content: `You have been added to a group!`,
      ephemeral: true,
    });
    return;
  }

  await interaction.followUp({
    content: `You have a group!`,
    ephemeral: true,
  });
};

export default { cooldown: 5, data: slashCommand, execute } as Command;
