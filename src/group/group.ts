import { ClassType } from "../enums/classTypes";
import Player from "../models/player";
import { GuildId } from "../types";
import { GroupSlot } from "../types/groupSlot";

class Group {
  readonly guildId: GuildId;
  private _activities: string[];
  private _openSlots: GroupSlot[] = [];
  private _owner: Player;

  constructor(guildId: GuildId, owner: Player, activities?: string[]) {
    this.guildId = guildId;
    this._activities = activities ?? [];
    this._owner = owner;
  }

  public get activities(): string[] {
    return this._activities;
  }

  public get openSlots(): GroupSlot[] {
    return this._openSlots;
  }

  public get owner(): Player {
    return this._owner;
  }

  public setOwner(owner: Player): void {
    this._owner = owner;
  }

  public addActivity(activity: string): void {
    this._activities.push(activity);
  }

  public openSlot(slot: GroupSlot): void {
    this._openSlots.push(slot);
  }

  public hasOpenSlot(classTypes: ClassType[], level: number): boolean {
    return this._openSlots.some((slot) => {
      return (
        slot.levelRange.min <= level &&
        slot.levelRange.max >= level &&
        slot.classTypes.some((classType) => classTypes.includes(classType))
      );
    });
  }
}

export default Group;
