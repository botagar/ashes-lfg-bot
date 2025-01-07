import { Activities } from "../enums/activities";
import { ClassRole } from "../enums/classTypes";
import Player from "../models/player";
import { GuildId } from "../types";

export enum PlayerQueueStatus {
  Queued,
  Exists,
}

export default class PlayerQueue {
  readonly guildId: GuildId;

  private _queue: [Player, Date, Activities[]][] = [];

  /**
   *
   */
  constructor(guildId: GuildId) {
    this.guildId = guildId;
  }

  add(player: Player, activities: Activities[]): PlayerQueueStatus {
    if (this._queue.find((p) => p[0].id === player.id)) {
      return PlayerQueueStatus.Exists;
    }

    this._queue.push([player, new Date(), activities]);
    return PlayerQueueStatus.Queued;
  }

  getPlayersInWaitForActivities(activities: Activities[]): Player[] {
    return this._queue
      .filter((p) => p[2].some((a) => activities.includes(a)))
      .map((p) => p[0]);
  }

  getPlayersInWaitForAsRole(role: ClassRole) {
    return this._queue
      .filter((p) => p[0].playerClass.classTags.includes(role))
      .map((p) => p[0]);
  }
}
