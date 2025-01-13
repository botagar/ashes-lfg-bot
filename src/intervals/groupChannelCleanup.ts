import { ChannelType, Client } from "discord.js";
import Groups from "../group/groups";
import { Time } from "../utils/time";
import logger from "../utils/logger";

const channelAbandonmentTimeout_ms = 5 * 60 * 1000; // 5 minutes
const channelCleanupInterval_ms = 60 * 1000; // 1 minute

export const initGroupChannelCleanup = (client: Client) => {
  setInterval(() => {
    const start = performance.now();
    logger.info("Checking for inactive or abandoned groups...");
    const groups = Groups.getInstance();
    const voiceChannels = client.channels.cache.filter(
      (c) => c.type === ChannelType.GuildVoice
    );
    voiceChannels.forEach((channel) => {
      const group = groups.findGroupByChannel(channel.id);
      if (group) {
        const guild = channel.guild;
        const members = channel.members.size;
        if (members === 0) {
          const lifetime_ms = Date.now() - new Date(group.createdAt).getTime();
          if (lifetime_ms > channelAbandonmentTimeout_ms) {
            logger.info({
              msg: "Abandoned group detected. Deleting group.",
              group: group,
              channel: { id: channel.id, name: channel.name },
              guild: { id: guild.id, name: guild.name },
            });
            groups.deleteGroup(guild.id, group.channelId);
            logger.info({
              msg: `Group [${group.channelId}] in guild [${guild.name}] has been deleted.`,
              group: group,
            });
            logger.info({
              msg: "Deleting channel",
              channel: { id: channel.id, name: channel.name },
              guild: { id: guild.id, name: guild.name },
            });
            channel.delete();
            logger.info({
              msg: `Channel [${channel.name}] in guild [${guild.name}] has been deleted.`,
            });
          } else {
            const hrms = Time.millisecondsToHumanReadable(lifetime_ms);
            logger.info(
              `Group [${channel.name}] in guild [${guild.name}] has been empty for ${hrms}.`
            );
          }
        }
      }
    });
    const end = performance.now();
    const elapsed = end - start;
    if (elapsed <= 999) {
      logger.info(
        `Group cleanup took ${elapsed}ms to process ${voiceChannels.size} channels.`
      );
    } else {
      const hrms = Time.millisecondsToHumanReadable(elapsed);
      logger.info(
        `Group cleanup took ${hrms} to process ${voiceChannels.size} channels.`
      );
    }
  }, channelCleanupInterval_ms);
};
