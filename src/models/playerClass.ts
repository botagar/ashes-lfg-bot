import { ClassNames } from "../enums/classNames";
import { ClassType } from "../enums/classTypes";

export default interface PlayerClass {
  name: ClassNames;
  classTags: ClassType[];
}

export const Cleric: PlayerClass = {
  name: ClassNames.Cleric,
  classTags: [ClassType.Healer],
};

export const Fighter: PlayerClass = {
  name: ClassNames.Fighter,
  classTags: [ClassType.DPS, ClassType.MeleeDPS],
};

export const Mage: PlayerClass = {
  name: ClassNames.Mage,
  classTags: [ClassType.DPS, ClassType.MagicDPS],
};

export const Ranger: PlayerClass = {
  name: ClassNames.Ranger,
  classTags: [ClassType.DPS, ClassType.RangeDPS],
};

export const Rogue: PlayerClass = {
  name: ClassNames.Rogue,
  classTags: [ClassType.DPS, ClassType.MeleeDPS],
};

export const Summoner: PlayerClass = {
  name: ClassNames.Summoner,
  classTags: [],
};

export const Bard: PlayerClass = {
  name: ClassNames.Bard,
  classTags: [ClassType.Support],
};

export const Tank: PlayerClass = {
  name: ClassNames.Tank,
  classTags: [ClassType.Tank],
};
