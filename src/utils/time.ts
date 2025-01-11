export class Time {
  static getNow(): number {
    return new Date().getTime();
  }

  static millisecondsToHumanReadable(milliseconds: number): string {
    const seconds = milliseconds / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;

    if (hours >= 1) {
      if (minutes % 60 === 0) {
        return `${Math.floor(hours)}h`;
      }
      return `${Math.floor(hours)}h ${Math.floor(minutes % 60)}m`;
    } else if (minutes >= 1) {
      if (seconds % 60 === 0) {
        return `${Math.floor(minutes)}m`;
      }
      return `${Math.floor(minutes)}m ${Math.floor(seconds % 60)}s`;
    } else {
      return `${Math.floor(seconds)}s`;
    }
  }
}
