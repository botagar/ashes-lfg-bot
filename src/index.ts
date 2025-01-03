import "dotenv/config";
import { Client, Events, GatewayIntentBits, MessageFlags } from "discord.js";
import events from "./events";
import { deployCommands } from "./deploy-commands";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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
