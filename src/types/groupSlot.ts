import { ClassType } from "../enums/classTypes";
import { LevelRange } from "../models/playerLevelRange";

export type GroupSlot = {
  classTypes: ClassType[];
  levelRange: LevelRange;
};
