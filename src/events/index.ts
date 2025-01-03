import clientReady from "./client-ready";
import interactionCreate from "./interaction-create";

export type DiscordUserEvent = {
  name: string;
  once: boolean;
  execute: (...args: any[]) => void;
};

export default [clientReady, interactionCreate];
