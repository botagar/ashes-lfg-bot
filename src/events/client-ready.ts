import { Client, Events } from "discord.js";
import { DiscordUserEvent } from ".";

const execute = async (client: Client) => {
  console.log(`Ready! Logged in as ${client.user?.tag ?? "Unknown"}`);
};

export default {
  name: Events.ClientReady,
  once: true,
  execute,
} as DiscordUserEvent;
