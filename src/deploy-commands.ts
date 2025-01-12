import pino from "pino";
import { REST, Routes } from "discord.js";

import { commands } from "./commands";

const commandsData = Object.values(commands).map((command) => command.data);
if (!process.env.DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN is not defined");
}
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});

type DeployCommandsProps = {
  clientId: string;
};

export async function deployCommands({ clientId }: DeployCommandsProps) {
  try {
    logger.info("Started refreshing application (/) commands.");
    logger.info({
      msg: "Commands data:",
      commands: commandsData.map((command) => {
        return { name: command.name, description: command.description };
      }),
    });

    await rest.put(Routes.applicationCommands(clientId), {
      body: commandsData,
    });

    logger.info("Successfully reloaded application (/) commands.");
  } catch (error) {
    logger.error(error);
  }
}
