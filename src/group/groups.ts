import { Activities } from "../enums/activities";
import Player from "../models/player";
import { GuildId } from "../types";
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

  createGroup(guildId: GuildId, activity: Activities, player: Player): Group {
    const existingGroups = this.groups.get(guildId) ?? [];

    const newGroup = new Group(guildId, player, [activity]);
    this.groups.set(guildId, [...existingGroups, newGroup]);

    return newGroup;
  }
}

export default Groups;
