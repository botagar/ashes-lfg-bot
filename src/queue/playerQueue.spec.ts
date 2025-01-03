import { describe, it, expect, beforeEach } from "vitest";
import PlayerQueue, { PlayerQueueStatus } from "./playerQueue";
import Player from "../models/player";
import { Cleric, Mage } from "../models/playerClass";
import { Activities } from "../enums/activities";

const guild1Id = 1;

describe("Player Queue", () => {
  let queue: PlayerQueue;

  beforeEach(() => {
    queue = new PlayerQueue(guild1Id);
  });

  it("should add new player to queue in guild", () => {
    const player = new Player(123, "player 1", Mage, 1, guild1Id);

    const res = queue.add(player, [Activities.EXPFarming]);

    expect(res).toBe(PlayerQueueStatus.Queued);
  });

  it("should not add new player to queue in guild if player already exists", () => {
    const player = new Player(123, "player 1", Mage, 1, guild1Id);

    const res = queue.add(player, [Activities.EXPFarming]);
    const res2 = queue.add(player, [Activities.EXPFarming]);

    expect(res).toBe(PlayerQueueStatus.Queued);
    expect(res2).toBe(PlayerQueueStatus.Exists);
  });

  it("should return 0 players in fresh queue", () => {
    const players = queue.getPlayersInWaitFor([Activities.EXPFarming]);

    expect(players).toStrictEqual([]);
  });

  it("should return they players in queue for activity", () => {
    const player = new Player(123, "player 1", Mage, 1, guild1Id);
    const player2 = new Player(124, "player 2", Cleric, 2, guild1Id);

    queue.add(player, [Activities.EXPFarming]);
    queue.add(player2, [Activities.EXPFarming]);
    queue.add(player2, [Activities.PvP]);

    const players = queue.getPlayersInWaitFor([Activities.EXPFarming]);

    expect(players).toStrictEqual([player, player2]);
  });
});
