import { describe, expect, test } from "vitest";
import { Time } from "./time";

describe("Time", () => {
  test.each([
    [1000, "1s"],
    [60000, "1m"],
    [61000, "1m 1s"],
    [3600000, "1h"],
  ])("should format %i milliseconds to %s", (input, expected) => {
    const formattedTime = Time.millisecondsToHumanReadable(input);

    expect(formattedTime).toBe(expected);
  });
});
