import { describe, it, expect } from "vitest";
import Group from "./group";
import { Activities } from "../enums/activities";
import { ClassType } from "../enums/classTypes";
import { GroupSlot } from "../types/groupSlot";
import Player from "../models/player";
import { Bard, Fighter } from "../models/playerClass";

const GUILD_ID = "1234567890";
const DEFAULT_OWNER = new Player("userId", "userName", Bard, 12, GUILD_ID);

describe("Group", () => {
  it("should create an empty group for a given activity within a guild", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER, [Activities.EXPFarming]);

    expect(group).toBeInstanceOf(Group);
    expect(group.guildId).toBe(GUILD_ID);
    expect(group.activities).toStrictEqual([Activities.EXPFarming]);
  });

  it("should add an activity to a group", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER, [Activities.EXPFarming]);

    group.addActivity(Activities.Raiding);

    expect(group.activities).toStrictEqual([
      Activities.EXPFarming,
      Activities.Raiding,
    ]);
  });

  it("should get current activities", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER, [
      Activities.EXPFarming,
      Activities.Raiding,
    ]);

    expect(group.activities).toStrictEqual([
      Activities.EXPFarming,
      Activities.Raiding,
    ]);
  });

  it("should create an empty group if no activities are provided", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER);

    expect(group).toBeInstanceOf(Group);
    expect(group.guildId).toBe(GUILD_ID);
    expect(group.activities).toStrictEqual([]);
  });

  it("should set a new group owner", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER);
    const owner = new Player("userId2", "userName2", Fighter, 25, GUILD_ID);

    group.setOwner(owner);

    expect(group.owner).toStrictEqual(owner);
  });

  it("should add an empty slot to group", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER);
    const groupSlot: GroupSlot = {
      classTypes: [ClassType.Healer],
      levelRange: { min: 1, max: 5 },
    };

    group.openSlot(groupSlot);

    const openSlots = group.openSlots;
    expect(openSlots.length).toBe(1);
    expect(openSlots).toContain(groupSlot);
  });

  it("should return true if a group has an open slot for a given class and level", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER);
    const groupSlot: GroupSlot = {
      classTypes: [ClassType.Healer],
      levelRange: { min: 1, max: 5 },
    };

    group.openSlot(groupSlot);

    const hasOpenSlot = group.hasOpenSlot([ClassType.Healer], 3);
    expect(hasOpenSlot).toBe(true);
  });

  it("should return false if a group has no open slot for a given class and level", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER);
    const groupSlot: GroupSlot = {
      classTypes: [ClassType.Healer],
      levelRange: { min: 1, max: 5 },
    };

    group.openSlot(groupSlot);

    const hasOpenSlot = group.hasOpenSlot([ClassType.Healer], 10);
    expect(hasOpenSlot).toBe(false);
  });
});
