import { Client, Events } from "discord.js";
import { DiscordUserEvent } from ".";
import logger from "../utils/logger";

const execute = async (client: Client) => {
  logger.info(`Ready! Logged in as [${client.user?.tag ?? "Unknown"}]`);
};

export default {
  name: Events.ClientReady,
  once: true,
  execute,
} as DiscordUserEvent;
