import {
  SlashCommandBuilder,
  CommandInteraction,
  ApplicationCommandOptionType,
} from "discord.js";
import { Command } from ".";
import { GuildId } from "../types";
import PlayerQueue from "../queue/playerQueue";
import Groups from "../group/groups";
import LFMHelpFlow from "./flows/lfmHelp";
import { ClassRoleFromString } from "../enums/classTypes";
import LFMListFlow from "./flows/lfmList";
import LFMOpenFlow from "./flows/lfmOpen";

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
  );

const guildQueues = new Map<GuildId, PlayerQueue>();

const execute = async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  console.log(interaction.options.data);
  const interactionSubcommand = interaction.options.data[0];
  if (!interactionSubcommand) return;

  const { name, type } = interactionSubcommand;
  if (type !== ApplicationCommandOptionType.Subcommand) return;

  switch (name) {
    case "help":
      return await LFMHelpFlow(interaction);
    case "list":
      return await LFMListFlow(interaction, interactionSubcommand, guildQueues);
    case "open":
      return await LFMOpenFlow(interaction);
    default:
      break;
  }

  await interaction.reply({
    content: `Unrecognized subcommand: ${name}`,
    ephemeral: true,
  });
};

export default { cooldown: 5, data: slashCommand, execute } as Command;
