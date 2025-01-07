import { ClassRole } from "../enums/classTypes";
import { LevelRange } from "../models/playerLevelRange";

export type GroupSlot = {
  classTypes: ClassRole[];
  levelRange: LevelRange;
};
