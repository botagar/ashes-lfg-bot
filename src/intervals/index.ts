import { Client } from "discord.js";
import { initGroupChannelCleanup } from "./groupChannelCleanup";

export const initIntervalJobs = (client: Client) => {
  initGroupChannelCleanup(client);
};
