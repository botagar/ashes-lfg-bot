import {
  SlashCommandBuilder,
  CommandInteraction,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from ".";
import LFMHelpFlow from "./flows/lfmHelp";
import LFMListFlow from "./flows/lfmList";
import LFMOpenFlow from "./flows/lfmOpen";
import LFMStatusFlow from "./flows/lfmStatus";
import logger from "../utils/logger";
import LFMCloseFlow from "./flows/lfmClose";
import LFMActivityFlow from "./flows/lfmActivity";
import LFMEditFlow from "./flows/lfmEdit";

const slashCommand = new SlashCommandBuilder()
  .setName("lfm")
  .setDescription("Look for more players.")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("help")
      .setDescription("Instructions on how to use the command.")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("list")
      .setDescription("List players looking for more.")
      .addStringOption((option) =>
        option
          .setName("role")
          .setDescription(
            "The players of a particular role looking for a group."
          )
          .setRequired(true)
          .addChoices(
            {
              name: "Tank",
              value: "Tank",
            },
            {
              name: "Healer",
              value: "Healer",
            },
            {
              name: "DPS",
              value: "DPS",
            },
            {
              name: "Support",
              value: "Support",
            },
            {
              name: "Range DPS",
              value: "Range DPS",
            },
            {
              name: "Melee DPS",
              value: "Melee DPS",
            },
            {
              name: "Magic DPS",
              value: "Magic DPS",
            },
            {
              name: "Physical DPS",
              value: "Physical DPS",
            }
          )
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("open")
      .setDescription("Open spot(s) in your group to more players.")
      .addStringOption((option) =>
        option
          .setName("role")
          .setDescription("The open role in the group.")
          .setRequired(true)
          .addChoices(
            {
              name: "Tank",
              value: "Tank",
            },
            {
              name: "Healer",
              value: "Healer",
            },
            {
              name: "DPS",
              value: "DPS",
            },
            {
              name: "Support",
              value: "Support",
            },
            {
              name: "Range DPS",
              value: "Range DPS",
            },
            {
              name: "Melee DPS",
              value: "Melee DPS",
            },
            {
              name: "Magic DPS",
              value: "Magic DPS",
            },
            {
              name: "Physical DPS",
              value: "Physical DPS",
            }
          )
      )
      .addStringOption((option) =>
        option
          .setName("level")
          .setDescription(
            "The required player level. Can be a number ie. 25 or a range ie. 1-5."
          )
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("count")
          .setDescription("The number of open spots for role.")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("invite-timeout")
          .setDescription("The duration an invite open. Default is 5 minutes.")
          .setRequired(false)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("edit")
      .setDescription("Edit the open slots in your group.")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("close").setDescription("Close group.")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("activity")
      .setDescription("Set the activity for your group.")
      .addStringOption((option) =>
        option
          .setName("activity")
          .setDescription("The activity your group is doing.")
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
              name: "PvP",
              value: "PvP",
            },
            {
              name: "Raiding",
              value: "Raiding",
            },
            {
              name: "Questing",
              value: "Questing",
            },
            {
              name: "Gathering",
              value: "Gathering",
            },
            {
              name: "Caravan",
              value: "Caravan",
            },
            {
              name: "Other",
              value: "Other",
            }
          )
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("status")
      .setDescription("Check the status of your group.")
  );

const execute = async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  const interactionSubcommand = interaction.options.data[0];
  logger.debug({
    msg: "Executing LFM Command",
    subcommand: interactionSubcommand,
  });
  if (!interactionSubcommand) return;

  const { name, type } = interactionSubcommand;
  if (type !== ApplicationCommandOptionType.Subcommand) return;

  switch (name) {
    case "help":
      return await LFMHelpFlow(interaction);
    case "list":
      return await LFMListFlow(interaction, interactionSubcommand);
    case "open":
      return await LFMOpenFlow(interaction);
    case "edit":
      return await LFMEditFlow(interaction);
    case "activity":
      return await LFMActivityFlow(interaction);
    case "status":
      return await LFMStatusFlow(interaction);
    case "close":
      return await LFMCloseFlow(interaction);
    default:
      break;
  }

  await interaction.reply({
    content: `Unrecognized subcommand: ${name}`,
    ephemeral: true,
  });
};

export default { cooldown: 5, data: slashCommand, execute } as Command;
