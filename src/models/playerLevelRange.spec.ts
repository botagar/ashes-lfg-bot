import { describe, it, expect } from "vitest";
import PlayerLevelRange from "./playerLevelRange";

describe("PlayerLevelRange", () => {
  it("should validate single level within range", () => {
    const levelRange = new PlayerLevelRange("15");
    expect(levelRange.isValid()).toBe(true);
  });

  it("should be false for single level of 0", () => {
    const levelRange = new PlayerLevelRange("0");
    expect(levelRange.isValid()).toBe(false);
  });

  it("should validate single level at max range", () => {
    const levelRange = new PlayerLevelRange("25");
    expect(levelRange.isValid()).toBe(true);
  });

  it("should invalidate single level out of range", () => {
    const levelRange = new PlayerLevelRange("30");
    expect(levelRange.isValid()).toBe(false);
  });

  it("should validate level range within range", () => {
    const levelRange = new PlayerLevelRange("5-20");
    expect(levelRange.isValid()).toBe(true);
  });

  it("should validate reversed level range within range", () => {
    const levelRange = new PlayerLevelRange("20-5");
    expect(levelRange.isValid()).toBe(true);
  });

  it("should validate same number range", () => {
    const levelRange = new PlayerLevelRange("10-10");
    expect(levelRange.isValid()).toBe(true);
  });

  it("should invalidate level range out of range", () => {
    const levelRange = new PlayerLevelRange("5-30");
    expect(levelRange.isValid()).toBe(false);
  });

  it("should invalidate level range of negative to positive", () => {
    const levelRange = new PlayerLevelRange("-5-5");
    expect(levelRange.isValid()).toBe(false);
  });

  it("should invalidate invalid format", () => {
    const levelRange = new PlayerLevelRange("abc");
    expect(levelRange.isValid()).toBe(false);
  });

  it("should invalidate invalid range format", () => {
    const levelRange = new PlayerLevelRange("5-abc");
    expect(levelRange.isValid()).toBe(false);
  });

  it("should invalidate invalid range format", () => {
    const levelRange = new PlayerLevelRange("5-");
    expect(levelRange.isValid()).toBe(false);
  });

  it("should invalidate invalid range format", () => {
    const levelRange = new PlayerLevelRange("-5");
    expect(levelRange.isValid()).toBe(false);
  });

  it("should return false for empty string", () => {
    const levelRange = new PlayerLevelRange("");
    expect(levelRange.isValid()).toBe(false);
  });

  it("should return min and max for range", () => {
    const levelRange = new PlayerLevelRange("5-10");
    expect(levelRange.min).toBe(5);
    expect(levelRange.max).toBe(10);
  });
});
