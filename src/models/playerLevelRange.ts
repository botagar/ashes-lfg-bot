export type LevelRange = {
  min: number;
  max: number;
};

class PlayerLevelRange {
  private levelRange: string;
  private _min: number;
  private _max: number;
  private _level: number;
  private _isValid: boolean;

  constructor(levelRange: string) {
    this.levelRange = levelRange;
    this._min = 0;
    this._max = 0;
    this._level = 0;
    this._isValid = false;

    const singleLevelPattern = /^(?:[1-9]|1[0-9]|2[0-5])$/;
    const rangePattern = /^(?:[1-9]|1[0-9]|2[0-5])-(?:[1-9]|1[0-9]|2[0-5])$/;

    if (singleLevelPattern.test(this.levelRange)) {
      this._level = Number(this.levelRange);
      this._min = this._level;
      this._max = this._level;
      this._isValid = true;
    } else if (rangePattern.test(this.levelRange)) {
      const [start, end] = this.levelRange.split("-").map(Number);
      this._min = start;
      this._max = end;
      this._level = start;
      this._isValid = start >= 1 && start <= 25 && end >= 1 && end <= 25;
    }
  }

  get max() {
    return this._max;
  }

  get min() {
    return this._min;
  }

  get level() {
    return this._level;
  }

  isValid(): boolean {
    return this._isValid;
  }

  toString(): string {
    if (this._isValid) {
      if (this._min === this._max) {
        return `${this._level}`;
      } else {
        return `${this._min}-${this._max}`;
      }
    }
    return "Invalid level range";
  }
}

export default PlayerLevelRange;
