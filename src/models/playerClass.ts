import { ClassNames } from "../enums/classNames";
import { ClassRole } from "../enums/classTypes";

export default interface PlayerClass {
  name: ClassNames;
  classTags: ClassRole[];
}

export const Cleric: PlayerClass = {
  name: ClassNames.Cleric,
  classTags: [ClassRole.Healer],
};

export const Fighter: PlayerClass = {
  name: ClassNames.Fighter,
  classTags: [ClassRole.DPS, ClassRole.MeleeDPS],
};

export const Mage: PlayerClass = {
  name: ClassNames.Mage,
  classTags: [ClassRole.DPS, ClassRole.MagicDPS],
};

export const Ranger: PlayerClass = {
  name: ClassNames.Ranger,
  classTags: [ClassRole.DPS, ClassRole.RangeDPS],
};

export const Rogue: PlayerClass = {
  name: ClassNames.Rogue,
  classTags: [ClassRole.DPS, ClassRole.MeleeDPS],
};

export const Summoner: PlayerClass = {
  name: ClassNames.Summoner,
  classTags: [],
};

export const Bard: PlayerClass = {
  name: ClassNames.Bard,
  classTags: [ClassRole.Support],
};

export const Tank: PlayerClass = {
  name: ClassNames.Tank,
  classTags: [ClassRole.Tank],
};
