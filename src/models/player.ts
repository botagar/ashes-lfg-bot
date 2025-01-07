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

  toString(): string {
    return `${this.name} - level ${this.level} ${this.playerClass.name}`;
  }
}
