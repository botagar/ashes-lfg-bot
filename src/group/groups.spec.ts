import { describe, it, expect, beforeEach } from "vitest";
import Groups from "./groups";
import Group from "./group";
import { Activities } from "../enums/activities";
import Player from "../models/player";
import { Bard } from "../models/playerClass";
import { ClassType } from "../enums/classTypes";

const GUILD_ID = "1234567890";

describe("Groups Singleton", () => {
  let groups: Groups;

  beforeEach(() => {
    groups = Groups.getInstance();
    groups.clear();
  });

  it("should create a singleton instance of Groups", () => {
    expect(groups).toBeInstanceOf(Groups);
  });

  it("should find no groups when searched", () => {
    const player = new Player("userId", "userName", Bard, 12, GUILD_ID);

    const group = groups.findOpenGroup(GUILD_ID, Activities.EXPFarming, player);

    expect(group).toBeUndefined();
  });

  it("should create a group", () => {
    const player = new Player("userId", "userName", Bard, 12, GUILD_ID);

    const group = groups.createGroup(GUILD_ID, Activities.EXPFarming, player);

    expect(group).toBeInstanceOf(Group);
  });

  it("should find a group when group exists with open slot", () => {
    const player = new Player("userId", "userName", Bard, 12, GUILD_ID);

    const group = groups.createGroup(GUILD_ID, Activities.EXPFarming, player);
    group.openSlot({
      classTypes: [ClassType.Support],
      levelRange: { min: 10, max: 20 },
    });

    const openGroup = groups.findOpenGroup(
      GUILD_ID,
      Activities.EXPFarming,
      player
    );

    expect(openGroup).toBeInstanceOf(Group);
    expect(openGroup?.openSlots).toHaveLength(1);
  });

  it("should not find a group when group exists with no open slot", () => {
    const player = new Player("userId", "userName", Bard, 12, GUILD_ID);

    const group = groups.createGroup(GUILD_ID, Activities.EXPFarming, player);
    group.openSlot({
      classTypes: [ClassType.DPS],
      levelRange: { min: 20, max: 25 },
    });

    const openGroup = groups.findOpenGroup(
      GUILD_ID,
      Activities.EXPFarming,
      player
    );

    expect(openGroup).toBeUndefined();
  });
});
