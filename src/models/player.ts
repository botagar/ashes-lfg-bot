import { DiscordUserId } from "../types/discordUserId";
import { GuildId } from "../types";
import PlayerClass from "./playerClass";

export default class Player {
  constructor(
    public id: DiscordUserId,
    public name: string,
    public playerClass: PlayerClass,
    public level: number,
    public guildId: GuildId
  ) {}
}
