import PlayerClass, {
  Tank,
  Cleric,
  Fighter,
  Mage,
  Ranger,
  Rogue,
  Summoner,
  Bard,
} from "./playerClass";
import { ClassNames } from "../enums/classNames";

class PlayerClassSelector {
  private static classMap: { [key: string]: any } = {
    [ClassNames.Tank]: Tank,
    [ClassNames.Cleric]: Cleric,
    [ClassNames.Fighter]: Fighter,
    [ClassNames.Mage]: Mage,
    [ClassNames.Ranger]: Ranger,
    [ClassNames.Rogue]: Rogue,
    [ClassNames.Summoner]: Summoner,
    [ClassNames.Bard]: Bard,
  };

  static getClassByName(className: any): PlayerClass | undefined {
    return this.classMap[className];
  }
}

export default PlayerClassSelector;
