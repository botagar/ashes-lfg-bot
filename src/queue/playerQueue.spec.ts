import { describe, it, expect, beforeEach } from "vitest";
import PlayerQueue from "./playerQueue";
import Player from "../models/player";
import { Mage } from "../models/playerClass";

describe("Player Queue", () => {
  let queue: PlayerQueue;

  beforeEach(() => {
    queue = new PlayerQueue();
  });

  it("should add player to queue in guild", () => {
    const guildId = 1;
    const player = new Player(123, "player 1", Mage, 1, guildId);

    queue.add(guildId, player);

    expect(queue.guild(guildId)).not.toBeUndefined();
  });
});
