function parseHexColor(hexColor: string): [number, number, number] | null {
  const hex = hexColor.trim().replace("#", "");
  if (!/^[\da-fA-F]{6}$/.test(hex)) return null;
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

function luminance([r, g, b]: [number, number, number]): number {
  const channels = [r, g, b].map((c) => {
    const normalized = c / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(colorA: string, colorB: string): number {
  const rgbA = parseHexColor(colorA);
  const rgbB = parseHexColor(colorB);
  if (!rgbA || !rgbB) return 0;
  const lumA = luminance(rgbA);
  const lumB = luminance(rgbB);
  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
}

export function hasAccessibleContrast(
  foreground: string,
  background: string,
  minimumRatio = 4.5,
): boolean {
  return contrastRatio(foreground, background) >= minimumRatio;
}

export function getContrastingTextColor(backgroundColor: string): string {
  return contrastRatio("#111827", backgroundColor) >= contrastRatio("#FFFFFF", backgroundColor)
    ? "#111827"
    : "#FFFFFF";
}
