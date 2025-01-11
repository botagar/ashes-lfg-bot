import { describe, it, expect } from "vitest";
import Group from "./group";
import { Activities } from "../enums/activities";
import { ClassRole } from "../enums/classTypes";
import { GroupSlot } from "../types/groupSlot";
import Player from "../models/player";
import { Cleric, Fighter } from "../models/playerClass";

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
      inviteTimeout_ms: 60000,
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
      inviteTimeout_ms: 60000,
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
      inviteTimeout_ms: 60000,
    };

    group.openSlot(groupSlot);

    const hasOpenSlot = group.hasOpenSlot([ClassRole.Healer], 10);
    expect(hasOpenSlot).toBe(false);
  });

  it("should record discord voice channel id", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID);

    group.setChannelId("123456789");

    expect(group.channelId).toBe("123456789");
  });

  it("should invite a valid player to an open slot", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID);
    const groupSlot: GroupSlot = {
      classTypes: [ClassRole.Healer],
      levelRange: { min: 1, max: 5 },
      inviteTimeout_ms: 60000,
    };

    group.openSlot(groupSlot);

    const player = new Player("userId", "userName", Cleric, 3, GUILD_ID);
    const wasInvited = group.invitePlayer(player);
    const invites = group.pendingInvites;

    expect(wasInvited).toBe(true);
    expect(invites.length).toBe(1);
    expect(invites[0].player).toBe(player);
  });

  it("should not invite a player to an open slot if the player does not meet the slot requirements", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID);
    const groupSlot: GroupSlot = {
      classTypes: [ClassRole.Healer],
      levelRange: { min: 1, max: 5 },
      inviteTimeout_ms: 60000,
    };

    group.openSlot(groupSlot);

    const player = new Player("userId", "userName", Fighter, 10, GUILD_ID);
    const wasInvited = group.invitePlayer(player);
    const invites = group.pendingInvites;

    expect(wasInvited).toBe(false);
    expect(invites.length).toBe(0);
  });

  it("should invite a player to a single open slot when multiple slots are available", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID);
    const groupSlot1: GroupSlot = {
      classTypes: [ClassRole.Healer],
      levelRange: { min: 1, max: 5 },
      inviteTimeout_ms: 60000,
    };
    const groupSlot2: GroupSlot = {
      classTypes: [ClassRole.Healer],
      levelRange: { min: 6, max: 10 },
      inviteTimeout_ms: 60000,
    };

    group.openSlot(groupSlot1);
    group.openSlot(groupSlot2);

    const player = new Player("userId", "userName", Cleric, 3, GUILD_ID);
    const wasInvited = group.invitePlayer(player);
    const invites = group.pendingInvites;

    expect(wasInvited).toBe(true);
    expect(invites.length).toBe(1);
    expect(invites[0].player).toBe(player);
    expect(invites[0].slot).toBe(groupSlot1);
  });

  it("should remove a player from pending invites when the player accepts the invite", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID);
    const groupSlot: GroupSlot = {
      classTypes: [ClassRole.Healer],
      levelRange: { min: 1, max: 5 },
      inviteTimeout_ms: 60000,
    };

    group.openSlot(groupSlot);

    const player = new Player("userId", "userName", Cleric, 3, GUILD_ID);
    group.invitePlayer(player);

    const playerJoined = group.acceptInvite("userId");

    expect(playerJoined).toBe(groupSlot);
    const invites = group.pendingInvites;
    expect(invites.length).toBe(0);

    expect(group.openSlots.length).toBe(0);
  });

  it("should removes a player from pending invites and return slot to open slots on timeout and place player into timed out list", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID);
    const groupSlot: GroupSlot = {
      classTypes: [ClassRole.Healer],
      levelRange: { min: 1, max: 5 },
      inviteTimeout_ms: 60000,
    };

    group.openSlot(groupSlot);

    const player = new Player("userId", "userName", Cleric, 3, GUILD_ID);
    group.invitePlayer(player);

    group.timeoutInvite(player);

    const invites = group.pendingInvites;
    expect(invites.length).toBe(0);

    expect(group.openSlots.length).toBe(1);
    expect(group.timedOutPlayers.length).toBe(1);
    expect(group.timedOutPlayers[0]).toBe(player);
  });

  it("should not invite a player if that player has already timed out", () => {
    const group = new Group(GUILD_ID, DEFAULT_OWNER_ID, CHANNEL_ID);
    const groupSlot: GroupSlot = {
      classTypes: [ClassRole.Healer],
      levelRange: { min: 1, max: 5 },
      inviteTimeout_ms: 60000,
    };

    group.openSlot(groupSlot);

    const player = new Player("userId", "userName", Cleric, 3, GUILD_ID);
    group.invitePlayer(player);

    group.timeoutInvite(player);

    const wasInvited = group.invitePlayer(player);
    const invites = group.pendingInvites;

    expect(wasInvited).toBe(false);
    expect(invites.length).toBe(0);
  });
});
