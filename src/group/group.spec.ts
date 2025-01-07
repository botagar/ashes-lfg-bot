import { describe, it, expect } from "vitest";
import Group from "./group";
import { Activities } from "../enums/activities";
import { ClassRole } from "../enums/classTypes";
import { GroupSlot } from "../types/groupSlot";
import Player from "../models/player";
import { Fighter } from "../models/playerClass";

const GUILD_ID = "1234567890";
const CHANNEL_ID = "9876543210";
const DEFAULT_OWNER_ID = "11111111";

describe("Group", () => {
  it("should create an empty group for a given activity within a guild", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID, [
      Activities.EXPFarming,
    ]);

    expect(group).toBeInstanceOf(Group);
    expect(group.guildId).toBe(GUILD_ID);
    expect(group.activities).toStrictEqual([Activities.EXPFarming]);
  });

  it("should add an activity to a group", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID, [
      Activities.EXPFarming,
    ]);

    group.addActivity(Activities.Raiding);

    expect(group.activities).toStrictEqual([
      Activities.EXPFarming,
      Activities.Raiding,
    ]);
  });

  it("should get current activities", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID, [
      Activities.EXPFarming,
      Activities.Raiding,
    ]);

    expect(group.activities).toStrictEqual([
      Activities.EXPFarming,
      Activities.Raiding,
    ]);
  });

  it("should create an empty group if no activities are provided", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID);

    expect(group).toBeInstanceOf(Group);
    expect(group.guildId).toBe(GUILD_ID);
    expect(group.activities).toStrictEqual([]);
  });

  it("should set a new group owner", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID);
    const newOwnerId = "222222222";

    group.setOwnerId(newOwnerId);

    expect(group.owner).toStrictEqual(newOwnerId);
  });

  it("should add an empty slot to group", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID);
    const groupSlot: GroupSlot = {
      classTypes: [ClassRole.Healer],
      levelRange: { min: 1, max: 5 },
    };

    group.openSlot(groupSlot);

    const openSlots = group.openSlots;
    expect(openSlots.length).toBe(1);
    expect(openSlots).toContain(groupSlot);
  });

  it("should return true if a group has an open slot for a given class and level", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID);
    const groupSlot: GroupSlot = {
      classTypes: [ClassRole.Healer],
      levelRange: { min: 1, max: 5 },
    };

    group.openSlot(groupSlot);

    const hasOpenSlot = group.hasOpenSlot([ClassRole.Healer], 3);
    expect(hasOpenSlot).toBe(true);
  });

  it("should return false if a group has no open slot for a given class and level", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID);
    const groupSlot: GroupSlot = {
      classTypes: [ClassRole.Healer],
      levelRange: { min: 1, max: 5 },
    };

    group.openSlot(groupSlot);

    const hasOpenSlot = group.hasOpenSlot([ClassRole.Healer], 10);
    expect(hasOpenSlot).toBe(false);
  });

  it.todo("should record discord voice channel id");
});
