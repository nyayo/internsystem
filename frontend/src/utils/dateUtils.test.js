import { describe, expect, it } from "@jest/globals";
import { getDaysBetween } from "./dateUtils";

describe("getDaysBetween", () => {
  it("returns the number of full days between two dates", () => {
    expect(getDaysBetween("2026-06-01", "2026-06-10")).toBe(9);
  });
});
