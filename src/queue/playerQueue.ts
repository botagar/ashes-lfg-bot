import { Activities } from "../enums/activities";
import { ClassRole } from "../enums/classTypes";
import Player from "../models/player";
import { GuildId } from "../types";

export enum PlayerQueueStatus {
  Queued,
  Exists,
}

export type QueueItem = {
  player: Player;
  queueTime: Date;
  activities: Activities[];
};

export default class PlayerQueue {
  readonly guildId: GuildId;

  private _queue: QueueItem[] = [];

  /**
   *
   */
  constructor(guildId: GuildId) {
    this.guildId = guildId;
  }

  add(player: Player, activities: Activities[]): PlayerQueueStatus {
    if (this._queue.find((p) => p.player.id === player.id)) {
      return PlayerQueueStatus.Exists;
    }

    this._queue.push({ player, queueTime: new Date(), activities });
    return PlayerQueueStatus.Queued;
  }

  getPlayersInWaitForActivities(activities: Activities[]): Player[] {
    return this._queue
      .filter((p) => p.activities.some((a) => activities.includes(a)))
      .map((p) => p.player);
  }

  getPlayersInWaitForAsRole(role: ClassRole): Player[] {
    return this._queue
      .filter((p) => p.player.playerClass.classTags.includes(role))
      .map((p) => p.player);
  }

  getNextPlayer(activities: Activities[], role: ClassRole): Player | undefined {
    const playerQueue = this._queue.filter(
      (p) =>
        p.activities.some((a) => activities.includes(a)) &&
        p.player.playerClass.classTags.includes(role)
    );
    const player = playerQueue?.shift()?.player;
    console.log(`Queue length: ${playerQueue.length}`);
    console.log(JSON.stringify(this._queue));

    this._queue = this._queue.filter((p) => p.player.id !== player?.id);

    return player;
  }
}
