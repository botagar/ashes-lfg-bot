import "dotenv/config";
import { Client, Events, GatewayIntentBits, MessageFlags } from "discord.js";
import events from "./events";
import { deployCommands } from "./deploy-commands";
import Groups from "./group/groups";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

client.login(process.env.DISCORD_TOKEN);

for (const event of events) {
  if (event.once) {
    console.log(`Registering once event: ${event.name}`);
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    console.log(`Registering event: ${event.name}`);
    client.on(event.name, (...args) => event.execute(...args));
  }
}

(async () => {
  console.log("Deploying commands...");
  if (process.env) {
    console.log(
      Object.keys(process.env)
        .filter((key) => key.startsWith("DISCORD"))
        .reduce((envVars, key) => {
          envVars[key] = process.env[key];
          return envVars;
        }, {} as Record<string, string | undefined>)
    );
  }
  await deployCommands({ guildId: process.env.DISCORD_DEV_SERVER_ID! });
})();

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
  const guild = newState.guild;
  const user = newState.member?.user;
  console.debug(
    `UID[${user?.id}]:[${user?.globalName}] CID[${newState.channelId}]:[${newState.channel?.name}] GID[${guild?.id}]:[${guild?.name}]`
  );
  if (newState.channelId === null) {
    console.log(
      `user ${user?.displayName} left channel ${oldState.channelId} in guild ${guild?.name}`
    );
  } else if (oldState.channelId === null) {
    console.log(
      `user ${user?.displayName} joined channel ${newState.channelId} in guild ${guild?.name}`
    );
    const group = Groups.getInstance().findGroupByChannel(newState.channelId);
    if (group && user) {
      const joinedSlot = group.acceptInvite(user.id);
      if (joinedSlot) {
        console.log(`user ${user.displayName} joined group`);
        newState.channel?.send({
          content: `${user} has joined the group as role [${joinedSlot.classTypes.join(
            ", "
          )}]`,
        });
      }
    }
  } else {
    console.log("user moved channels", oldState.channelId, newState.channelId);
  }
});
