import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Command } from ".";

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
          name: "Bard",
          value: "bard",
        },
        {
          name: "Cleric",
          value: "cleric",
        },
        {
          name: "Mage",
          value: "mage",
        },
        {
          name: "Ranger",
          value: "ranger",
        },
        {
          name: "Tank",
          value: "tank",
        }
      )
  )
  .addNumberOption((option) =>
    option
      .setName("level")
      .setDescription("Your current level.")
      .setRequired(true)
  );

const execute = async (interaction: CommandInteraction) => {
  const playerClass = interaction.options.get("class");
  const playerLevel = interaction.options.get("level");
  await interaction.reply({
    content: `Searching for a group for ${interaction.user.tag} as a level ${playerLevel?.value} ${playerClass?.value}!`,
    ephemeral: true,
  });
  await interaction.followUp({
    content: `You have a group!`,
    ephemeral: true,
  });
};

export default { cooldown: 5, data: slashCommand, execute } as Command;
