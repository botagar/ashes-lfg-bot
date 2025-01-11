import { describe, it, expect, beforeEach } from "vitest";
import PlayerQueue, { PlayerQueueStatus } from "./playerQueue";
import Player from "../models/player";
import { Cleric, Mage } from "../models/playerClass";
import { Activities } from "../enums/activities";
import { ClassRole } from "../enums/classTypes";

const guild1Id = "1234567890";

describe("Player Queue", () => {
  let queue: PlayerQueue;

  beforeEach(() => {
    queue = new PlayerQueue(guild1Id);
  });

  it("should add new player to queue in guild", () => {
    const player = new Player("123", "player 1", Mage, 1, guild1Id);

    const res = queue.add(player, [Activities.EXPFarming]);

    expect(res).toBe(PlayerQueueStatus.Queued);
  });

  it("should not add new player to queue in guild if player already exists", () => {
    const player = new Player("123", "player 1", Mage, 1, guild1Id);

    const res = queue.add(player, [Activities.EXPFarming]);
    const res2 = queue.add(player, [Activities.EXPFarming]);

    expect(res).toBe(PlayerQueueStatus.Queued);
    expect(res2).toBe(PlayerQueueStatus.Exists);
  });

  it("should return 0 players in fresh queue", () => {
    const players = queue.getPlayersInWaitForActivities([
      Activities.EXPFarming,
    ]);

    expect(players).toStrictEqual([]);
  });

  it("should return they players in queue for activity", () => {
    const player = new Player("123", "player 1", Mage, 1, guild1Id);
    const player2 = new Player("124", "player 2", Cleric, 2, guild1Id);

    queue.add(player, [Activities.EXPFarming]);
    queue.add(player2, [Activities.EXPFarming]);
    queue.add(player2, [Activities.PvP]);

    const players = queue.getPlayersInWaitForActivities([
      Activities.EXPFarming,
    ]);

    expect(players).toStrictEqual([player, player2]);
  });

  it("should return they players in queue for a role", () => {
    const player = new Player("123", "player 1", Mage, 1, guild1Id);
    const player2 = new Player("124", "player 2", Cleric, 2, guild1Id);

    queue.add(player, [Activities.EXPFarming]);
    queue.add(player2, [Activities.EXPFarming]);
    queue.add(player2, [Activities.PvP]);

    const players = queue.getPlayersInWaitForAsRole(ClassRole.Healer);

    expect(players).toStrictEqual([player2]);
  });

  it("should return the next player in queue for an activity", () => {
    const player = new Player("123", "player 1", Mage, 1, guild1Id);
    const player2 = new Player("124", "player 2", Mage, 2, guild1Id);
    const player3 = new Player("125", "player 3", Mage, 25, guild1Id);
    const player4 = new Player("126", "player 4", Mage, 21, guild1Id);

    queue.add(player, [Activities.EXPFarming]);
    queue.add(player2, [Activities.EXPFarming]);
    queue.add(player3, [Activities.EXPFarming]);
    queue.add(player2, [Activities.PvP]);
    queue.add(player4, [Activities.PvP]);

    let nextPlayer = queue.getNextPlayer(
      [Activities.EXPFarming],
      ClassRole.DPS
    );
    expect(nextPlayer).toStrictEqual(player);

    nextPlayer = queue.getNextPlayer([Activities.EXPFarming], ClassRole.DPS);
    expect(nextPlayer).toStrictEqual(player2);

    nextPlayer = queue.getNextPlayer([Activities.Caravan], ClassRole.DPS);
    expect(nextPlayer).toBeUndefined();

    nextPlayer = queue.getNextPlayer([Activities.PvP], ClassRole.DPS);
    expect(nextPlayer).toStrictEqual(player4);
  });
});
