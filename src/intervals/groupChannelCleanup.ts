import { ChannelType, Client } from "discord.js";
import { performance } from "perf_hooks";
import Groups from "../group/groups";

const channelAbandonmentTimeout_ms = 5 * 60 * 1000; // 5 minutes
const channelCleanupInterval_ms = 60 * 1000; // 1 minute

export const initGroupChannelCleanup = (client: Client) => {
  setInterval(() => {
    const start = performance.now();
    console.log("Checking for inactive or abandoned groups...");
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
            console.log(
              `Group [${channel.name}] in guild [${guild.name}] has been abandoned.`
            );
            groups.deleteGroup(guild.id, group.channelId);
            console.log(
              `Channel [${channel.name}] in guild [${guild.name}] has been deleted.`
            );
            channel.delete();
          } else {
            // TODO: Convert ms to human-readable format
            console.log(
              `Group [${channel.name}] in guild [${guild.name}] has been inactive for ${lifetime_ms}ms.`
            );
          }
        }
      }
    });
    const end = performance.now();
    console.log(
      `Group cleanup took ${end - start}ms to process ${
        voiceChannels.size
      } channels.`
    );
  }, channelCleanupInterval_ms);
};
