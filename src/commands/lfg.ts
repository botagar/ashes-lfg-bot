import {
  SlashCommandBuilder,
  CommandInteraction,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from ".";
import logger from "../utils/logger";
import LFGRegisterFlow from "./flows/lfgRegister";
import LFGHelpFlow from "./flows/lfgHelp";
import LFGLeaveFlow from "./flows/lfgLeave";

const slashCommand = new SlashCommandBuilder()
  .setName("lfg")
  .setDescription("Register to look for a group.")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("help")
      .setDescription("Instructions on how to use the command.")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("register")
      .setDescription("Register your interest in joining a group.")
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
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("leave").setDescription("Leave the queue.")
  );

const execute = async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  const interactionSubcommand = interaction.options.data[0];
  logger.debug({
    msg: "Executing LFG Command",
    subcommand: interactionSubcommand,
  });
  if (!interactionSubcommand) return;

  const { name, type } = interactionSubcommand;
  if (type !== ApplicationCommandOptionType.Subcommand) return;

  switch (name) {
    case "help":
      return await LFGHelpFlow(interaction);
    case "register":
      return await LFGRegisterFlow(interaction, interactionSubcommand);
    case "leave":
      return await LFGLeaveFlow(interaction);
    default:
      logger.warn({
        msg: "Invalid subcommand",
        subcommand: interactionSubcommand,
      });
      break;
  }
};

export default { cooldown: 5, data: slashCommand, execute } as Command;
