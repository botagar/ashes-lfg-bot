import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import events from "./events";
import { deployCommands } from "./deploy-commands";
import OnVoceStateUpdate from "./events/voiceStateUpdate";
import { initIntervalJobs } from "./intervals";
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});
logger.info(`Starting LFG bot...`);

logger.info(`Initializing Discord client...`);
const discordClientIntents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMembers,
];
if (process.env) {
  const discordEnvVars = Object.keys(process.env)
    .filter((key) => key.startsWith("DISCORD"))
    .reduce((envVars, key) => {
      envVars[key] = process.env[key];
      return envVars;
    }, {} as Record<string, string | undefined>);
  logger.debug({
    DISCORD_ENV_VARS: discordEnvVars,
    DISCORD_CLIENT_INTENTS: discordClientIntents,
  });
}
const client = new Client({
  intents: discordClientIntents,
});
logger.info(`Discord client initialized`);

logger.info(`Logging in to Discord...`);
client.login(process.env.DISCORD_TOKEN);
logger.info(`Logged in to Discord`);

for (const event of events) {
  logger.info({
    msg: "Registering Discord event",
    event: event,
  });
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

(async () => {
  logger.info("Deploying commands...");
  await deployCommands({ guildId: process.env.DISCORD_DEV_SERVER_ID! });
})();

OnVoceStateUpdate(client);

initIntervalJobs(client);
