import { Activities } from "../enums/activities";
import { ClassRole } from "../enums/classTypes";
import Player from "../models/player";
import { DiscordUserId, GuildId } from "../types";
import { GroupSlot } from "../types/groupSlot";

export type GroupInvite = {
  player: Player;
  slot: GroupSlot;
  invitedAt: Date;
};

class Group {
  readonly guildId: GuildId;
  readonly createdAt: Date = new Date();
  private _activities: string[];
  private _openSlots: GroupSlot[] = [];
  private _pendingInvites: GroupInvite[] = [];
  private _timedOutPlayers: Player[] = [];
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

  public get pendingInvites(): GroupInvite[] {
    return this._pendingInvites;
  }

  public get timedOutPlayers(): Player[] {
    return this._timedOutPlayers;
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

  public invitePlayer(player: Player): boolean {
    if (
      this._timedOutPlayers.some(
        (timedOutPlayer) => timedOutPlayer.id === player.id
      )
    ) {
      return false;
    }

    const slotIndex = this._openSlots.findIndex((slot) => {
      return (
        slot.levelRange.min <= player.level &&
        slot.levelRange.max >= player.level &&
        slot.classTypes.some((classType) =>
          player.playerClass.classTags.includes(classType)
        )
      );
    });

    if (slotIndex === -1) {
      return false;
    }

    this._pendingInvites.push({
      player,
      slot: this._openSlots[slotIndex],
      invitedAt: new Date(),
    });
    this._openSlots.splice(slotIndex, 1);
    return true;
  }

  public acceptInvite(playerId: DiscordUserId): GroupSlot | undefined {
    const inviteIndex = this._pendingInvites.findIndex(
      (invite) => invite.player.id === playerId
    );

    if (inviteIndex === -1) {
      return undefined;
    }

    const slot = this._pendingInvites[inviteIndex].slot;
    this._pendingInvites.splice(inviteIndex, 1);
    return slot;
  }

  public timeoutInvite(player: Player): void {
    const inviteIndex = this._pendingInvites.findIndex(
      (invite) => invite.player.id === player.id
    );

    if (inviteIndex === -1) {
      return;
    }

    const invite = this._pendingInvites[inviteIndex];
    this._timedOutPlayers.push(invite.player);
    this._openSlots.push(invite.slot);
    this._pendingInvites.splice(inviteIndex, 1);
  }

  setActivity(activity: Activities) {
    this._activities = [activity];
  }
}

export default Group;
