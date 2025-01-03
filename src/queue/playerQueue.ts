import Player from "../models/player";
import { GuildId } from "../types";

export default class PlayerQueue {
  private _queue: Map<GuildId, [Date, Player]> = new Map();

  /**
   *
   */
  constructor() {}

  add(guildId: number, player: Player) {
    this._queue.set(guildId, [new Date(), player]);
  }

  guild(guildId: number) {
    return this._queue.get(guildId);
  }
}
