import { describe, it, expect } from "vitest";
import { hasAccessibleContrast, getContrastingTextColor } from "../colorContrast";

describe("hasAccessibleContrast", () => {
  it("returns true for black on white (maximum contrast)", () => {
    expect(hasAccessibleContrast("#000000", "#FFFFFF")).toBe(true);
  });

  it("returns false for white on white (no contrast)", () => {
    expect(hasAccessibleContrast("#FFFFFF", "#FFFFFF")).toBe(false);
  });

  it("returns false for same-color dark pair", () => {
    expect(hasAccessibleContrast("#000000", "#000000")).toBe(false);
  });

  it("uses 4.5 as default minimum ratio (WCAG AA body text)", () => {
    // #595959 on white passes AA (~7.0:1)
    expect(hasAccessibleContrast("#595959", "#FFFFFF")).toBe(true);
    // #AAAAAA on white fails AA (~2.32:1)
    expect(hasAccessibleContrast("#AAAAAA", "#FFFFFF")).toBe(false);
  });

  it("accepts a custom minimum ratio", () => {
    // lower threshold passes combinations that would fail at 4.5
    expect(hasAccessibleContrast("#AAAAAA", "#FFFFFF", 2)).toBe(true);
  });

  it("returns false for invalid hex colors", () => {
    expect(hasAccessibleContrast("not-a-color", "#FFFFFF")).toBe(false);
    expect(hasAccessibleContrast("#FFFFFF", "rgb(0,0,0)")).toBe(false);
  });

  it("is commutative — order of foreground/background doesn't matter", () => {
    const ab = hasAccessibleContrast("#000000", "#FFFFFF");
    const ba = hasAccessibleContrast("#FFFFFF", "#000000");
    expect(ab).toBe(ba);
  });
});

describe("getContrastingTextColor", () => {
  it("returns white text for very dark backgrounds", () => {
    expect(getContrastingTextColor("#000000")).toBe("#FFFFFF");
    expect(getContrastingTextColor("#111827")).toBe("#FFFFFF");
    expect(getContrastingTextColor("#1F2937")).toBe("#FFFFFF");
  });

  it("returns dark text for very light backgrounds", () => {
    expect(getContrastingTextColor("#FFFFFF")).toBe("#111827");
    expect(getContrastingTextColor("#F9FAFB")).toBe("#111827");
    expect(getContrastingTextColor("#E5E7EB")).toBe("#111827");
  });

  it("returns a valid hex string", () => {
    const result = getContrastingTextColor("#4F46E5");
    expect(result === "#111827" || result === "#FFFFFF").toBe(true);
  });
});
