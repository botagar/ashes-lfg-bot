export enum ClassRole {
  Tank = "Tank",
  Healer = "Healer",
  DPS = "DPS",
  Support = "Support",
  RangeDPS = "Range DPS",
  MeleeDPS = "Melee DPS",
  MagicDPS = "Magic DPS",
  PhysicalDPS = "Physical DPS",
}

export const ClassRoleFromString = (value: string): ClassRole | undefined => {
  switch (value) {
    case "Tank":
      return ClassRole.Tank;
    case "Healer":
      return ClassRole.Healer;
    case "DPS":
      return ClassRole.DPS;
    case "Support":
      return ClassRole.Support;
    case "Range DPS":
      return ClassRole.RangeDPS;
    case "Melee DPS":
      return ClassRole.MeleeDPS;
    case "Magic DPS":
      return ClassRole.MagicDPS;
    case "Physical DPS":
      return ClassRole.PhysicalDPS;
    default:
      return undefined;
  }
};
