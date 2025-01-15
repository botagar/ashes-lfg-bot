import { APIEmbed, APIEmbedField, codeBlock, inlineCode } from "discord.js";
import { Time } from "../../utils/time";

const GenerateLFGHelpEmbed = (): APIEmbed => {
  const lfgSection: APIEmbedField = {
    name: `Looking for Group (LFG)`,
    value: `Register to look for a group by using the ${inlineCode(
      "/lfg"
    )} command.`,
  };
  const lfgRegisterSubcommand: APIEmbedField = {
    name: `Subcommand Register`,
    value: `${codeBlock("/lfg register [class] [level] [activity]")}`,
  };
  const lfgRegisterSubcommandOptions: APIEmbedField = {
    name: `Options`,
    value: `**Class**: Your current class.\n**Level**: Your current level (number between and including 1-25).\n**Activity**: The activity you want to do.`,
  };
  const lfgRegisterExample: APIEmbedField = {
    name: `Example`,
    value: `${codeBlock("/lfg register bard 10 EXP Farming")}`,
  };

  const lfgLeaveSubcommand: APIEmbedField = {
    name: `Subcommand Leave`,
    value: `${codeBlock("/lfg leave")}`,
  };
  const lfgLeaveSubcommandExplanation: APIEmbedField = {
    name: `Explanation`,
    value: `This command will remove you from the queue.`,
  };

  const embed: APIEmbed = {
    color: 0xffff00,
    title: "lfg command help",
    fields: [
      lfgSection,
      lfgRegisterSubcommand,
      lfgRegisterSubcommandOptions,
      lfgRegisterExample,
      lfgLeaveSubcommand,
      lfgLeaveSubcommandExplanation,
    ],
    timestamp: new Date().toISOString(),
  };

  return embed;
};

const GenerateLFMHelpEmbed = (): APIEmbed => {
  const lfmSection: APIEmbedField = {
    name: `Looking for Members (LFM)`,
    value: `Look for more players by using the ${inlineCode("/lfm")} command.`,
  };

  const lfmOpenSubcommand: APIEmbedField = {
    name: `Subcommand Open`,
    value: `${codeBlock("/lfm open [role] [level] [count]")}`,
  };
  const lfmOpenSubcommandOptions: APIEmbedField = {
    name: `Options`,
    value: `**Role**: The role you are looking for.\n**Level**: The level value or range you are looking for. (ie. 15 or 20-25)\n**Count**: The number of spots you are opening with these options.`,
  };

  const lfmStatusSubcommand: APIEmbedField = {
    name: `Subcommand Status`,
    value: `${codeBlock("/lfm status")}`,
  };
  const lfmStatusSubcommandExplanation: APIEmbedField = {
    name: `Explanation`,
    value: `This command will show the current status of the group such as open role slots and pending invites.`,
  };

  const lfmListSubcommand: APIEmbedField = {
    name: `Subcommand List`,
    value: `${codeBlock("/lfm list [role]")}`,
  };
  const lfmListSubcommandOptions: APIEmbedField = {
    name: `Options`,
    value: `**Role**: The role you are querying for.`,
  };
  const lfmListSubcommandExplanation: APIEmbedField = {
    name: `Explanation`,
    value: `This command will show the current list of players of the specified role currently in queue.`,
  };

  const embed: APIEmbed = {
    color: 0xffff00,
    title: "lfm command help",
    fields: [
      lfmSection,
      lfmOpenSubcommand,
      lfmOpenSubcommandOptions,
      lfmStatusSubcommand,
      lfmStatusSubcommandExplanation,
      lfmListSubcommand,
      lfmListSubcommandOptions,
      lfmListSubcommandExplanation,
    ],
    timestamp: new Date().toISOString(),
  };

  return embed;
};

export { GenerateLFGHelpEmbed, GenerateLFMHelpEmbed };
