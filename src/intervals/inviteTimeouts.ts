import { Client } from "discord.js";
import { Time } from "../utils/time";
import Groups from "../group/groups";
import logger from "../utils/logger";

const INVITE_TIMEOUT_CHECK_INTERVAL_MS = 30000; // 30 seconds
const DEFAULT_INVITE_TIMEOUT_MS = 60000; // 1 minute

export const initInviteTimeouts = (client: Client) => {
  setInterval(() => {
    const start = performance.now();

    logger.info("Checking for timed out invites...");

    const guilds = client.guilds.cache;
    for (const guild of guilds) {
      const groups = Groups.getInstance().getGroupsInGuild(guild[0]);
      logger.debug({
        msg: "Checking for timed out invites in guild",
        guild: { id: guild[1].id, name: guild[1].name },
      });
      for (const group of groups) {
        const invites = group.pendingInvites;
        const channel = guild[1].channels.cache.get(group.channelId);
        logger.debug({
          msg: "Checking for timed out invites in group",
          group: {
            channel: group.channelId,
            owner: group.owner,
            activity: group.activities,
            invites: invites,
          },
        });
        for (const invite of invites) {
          const lifetime_ms = Date.now() - invite.invitedAt.getTime();
          if (lifetime_ms > DEFAULT_INVITE_TIMEOUT_MS) {
            group.timeoutInvite(invite.player);
            logger.info({
              msg: "Timed out invite",
              player: invite.player,
              group: group.channelId,
            });
            if (channel && channel.isVoiceBased()) {
              const player = guild[1].members.cache.get(invite.player.id);
              player &&
                channel.send(
                  `Invite for [${player}] has timed out. Please reopen the slot.`
                );
            } else {
              logger.warn({
                msg: "Channel not found to alert group of timed out invite",
                channel: group.channelId,
                guild: { id: guild[1].id, name: guild[1].name },
              });
            }
          }
        }
      }
    }

    const end = performance.now();
    const elapsed = end - start;
    if (elapsed <= 999) {
      logger.info(`Invite Timeout took ${elapsed}ms to process`);
    } else {
      const hrms = Time.millisecondsToHumanReadable(elapsed);
      logger.info(`Invite Timeout took ${hrms} to process`);
    }
  }, INVITE_TIMEOUT_CHECK_INTERVAL_MS);
};
