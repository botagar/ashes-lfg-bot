const { REST, Routes } = require("discord.js");
import { commands } from "./commands";

const commandsData = Object.values(commands).map((command) => command.data);
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    console.log("Started refreshing application (/) commands.");
    console.log(
      "Commands data:",
      commandsData.map((command) => {
        return { name: command.name, description: command.description };
      })
    );

    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId),
      {
        body: commandsData,
      }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

// For global commands
// Routes.applicationCommands(clientId)
