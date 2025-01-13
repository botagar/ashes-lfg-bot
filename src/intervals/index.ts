import { Client } from "discord.js";
import { initGroupChannelCleanup } from "./groupChannelCleanup";
import { initInviteTimeouts } from "./inviteTimeouts";

export const initIntervalJobs = (client: Client) => {
  initGroupChannelCleanup(client);
  initInviteTimeouts(client);
};
