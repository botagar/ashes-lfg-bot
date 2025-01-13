import { Activities } from "../enums/activities";
import Player from "../models/player";
import { DiscordUserId, GuildId, VoiceChannelId } from "../types";
import Group from "./group";

class Groups {
  private static instance: Groups;
  private groups: Map<GuildId, Group[]>;

  private constructor() {
    this.groups = new Map();
  }

  public static getInstance(): Groups {
    if (!Groups.instance) {
      Groups.instance = new Groups();
    }
    return Groups.instance;
  }

  public clear(): void {
    this.groups.clear();
  }

  getGroupsInGuild(GUILD_ID: string): Group[] {
    return this.groups.get(GUILD_ID) ?? [];
  }

  findGroupByChannel(channelId: string): Group | undefined {
    for (const groups of this.groups.values()) {
      const group = groups.find((g) => g.channelId === channelId);
      if (group) {
        return group;
      }
    }
    return undefined;
  }

  findOpenGroup(
    guildId: GuildId,
    activity: Activities,
    player: Player
  ): Group | undefined {
    const existingGroups = this.groups.get(guildId);
    if (!existingGroups) {
      return undefined;
    }

    const openGroup = existingGroups.find((group) => {
      const classType = player.playerClass.classTags;
      return (
        group.activities.includes(activity) &&
        group.hasOpenSlot(classType, player.level)
      );
    });
    return openGroup;
  }

  createGroup(
    guildId: GuildId,
    channelId: VoiceChannelId,
    ownerId: DiscordUserId,
    activity: Activities
  ): Group {
    const existingGroups = this.groups.get(guildId) ?? [];

    const newGroup = new Group(guildId, ownerId, channelId, [activity]);
    this.groups.set(guildId, [...existingGroups, newGroup]);

    return newGroup;
  }

  deleteGroup(guildId: GuildId, channelId: VoiceChannelId): void {
    const existingGroups = this.groups.get(guildId) ?? [];
    const updatedGroups = existingGroups.filter(
      (group) => group.channelId !== channelId
    );
    this.groups.set(guildId, updatedGroups);
  }
}

export default Groups;
