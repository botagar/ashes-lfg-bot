import { ClassRole } from "../enums/classTypes";
import Player from "../models/player";
import { DiscordUserId, GuildId } from "../types";
import { GroupSlot } from "../types/groupSlot";

class Group {
  readonly guildId: GuildId;
  private _activities: string[];
  private _openSlots: GroupSlot[] = [];
  private _ownerId: DiscordUserId;
  private _channelId: string;

  constructor(
    guildId: GuildId,
    ownerId: DiscordUserId,
    channelId: string,
    activities?: string[]
  ) {
    this.guildId = guildId;
    this._activities = activities ?? [];
    this._ownerId = ownerId;
    this._channelId = channelId;
  }

  public get activities(): string[] {
    return this._activities;
  }

  public get openSlots(): GroupSlot[] {
    return this._openSlots;
  }

  public get owner(): DiscordUserId {
    return this._ownerId;
  }

  public get channelId(): string {
    return this._channelId;
  }

  public setOwnerId(ownerId: DiscordUserId): void {
    this._ownerId = ownerId;
  }

  public setChannelId(channelId: string): void {
    this._channelId = channelId;
  }

  public addActivity(activity: string): void {
    this._activities.push(activity);
  }

  public openSlot(slot: GroupSlot): void {
    this._openSlots.push(slot);
  }

  public hasOpenSlot(classTypes: ClassRole[], level: number): boolean {
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
