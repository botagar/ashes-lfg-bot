import { describe, it, expect } from "vitest";
import PlayerClassSelector from "./playerClassSelector";
import {
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

describe("PlayerClassSelector", () => {
  it("should return undefined for an unknown class name", () => {
    const result = PlayerClassSelector.getClassByName("UnknownClass");
    expect(result).toBeUndefined();
  });

  it("should return undefined for an undefined", () => {
    const result = PlayerClassSelector.getClassByName(undefined);
    expect(result).toBeUndefined();
  });

  it("should return the correct PlayerClass for Tank", () => {
    const result = PlayerClassSelector.getClassByName(ClassNames.Tank);
    expect(result).toBe(Tank);
  });

  it("should return the correct PlayerClass for Cleric", () => {
    const result = PlayerClassSelector.getClassByName(ClassNames.Cleric);
    expect(result).toBe(Cleric);
  });

  it("should return the correct PlayerClass for Fighter", () => {
    const result = PlayerClassSelector.getClassByName(ClassNames.Fighter);
    expect(result).toBe(Fighter);
  });

  it("should return the correct PlayerClass for Mage", () => {
    const result = PlayerClassSelector.getClassByName(ClassNames.Mage);
    expect(result).toBe(Mage);
  });

  it("should return the correct PlayerClass for Ranger", () => {
    const result = PlayerClassSelector.getClassByName(ClassNames.Ranger);
    expect(result).toBe(Ranger);
  });

  it("should return the correct PlayerClass for Rogue", () => {
    const result = PlayerClassSelector.getClassByName(ClassNames.Rogue);
    expect(result).toBe(Rogue);
  });

  it("should return the correct PlayerClass for Summoner", () => {
    const result = PlayerClassSelector.getClassByName(ClassNames.Summoner);
    expect(result).toBe(Summoner);
  });

  it("should return the correct PlayerClass for Bard", () => {
    const result = PlayerClassSelector.getClassByName(ClassNames.Bard);
    expect(result).toBe(Bard);
  });
});
