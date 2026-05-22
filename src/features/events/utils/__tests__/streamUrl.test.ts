import { describe, it, expect } from "vitest";
import { isAllowedStreamUrl, isHttpsUrl, isValidBannerUrl } from "../streamUrl";

describe("isAllowedStreamUrl", () => {
  it("accepts youtube.com URLs", () => {
    expect(isAllowedStreamUrl("https://youtube.com/watch?v=abc")).toBe(true);
  });

  it("accepts www.youtube.com URLs", () => {
    expect(isAllowedStreamUrl("https://www.youtube.com/embed/abc")).toBe(true);
  });

  it("accepts youtu.be URLs", () => {
    expect(isAllowedStreamUrl("https://youtu.be/abc")).toBe(true);
  });

  it("accepts player.vimeo.com URLs", () => {
    expect(isAllowedStreamUrl("https://player.vimeo.com/video/123")).toBe(true);
  });

  it("accepts vimeo.com URLs", () => {
    expect(isAllowedStreamUrl("https://vimeo.com/123")).toBe(true);
  });

  it("rejects http URLs", () => {
    expect(isAllowedStreamUrl("http://youtube.com/watch?v=abc")).toBe(false);
  });

  it("rejects unknown domains", () => {
    expect(isAllowedStreamUrl("https://evil.com/embed")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isAllowedStreamUrl("")).toBe(false);
  });

  it("rejects malformed URLs", () => {
    expect(isAllowedStreamUrl("not-a-url")).toBe(false);
  });
});

describe("isHttpsUrl", () => {
  it("returns true for https URLs", () => {
    expect(isHttpsUrl("https://example.com")).toBe(true);
  });

  it("returns false for http URLs", () => {
    expect(isHttpsUrl("http://example.com")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isHttpsUrl("")).toBe(false);
  });

  it("returns false for malformed URLs", () => {
    expect(isHttpsUrl("not-a-url")).toBe(false);
  });
});

describe("isValidBannerUrl", () => {
  it("accepts https URLs", () => {
    expect(isValidBannerUrl("https://example.com/banner.jpg")).toBe(true);
  });

  it("accepts base64 JPEG data URLs", () => {
    expect(isValidBannerUrl("data:image/jpeg;base64,/9j/4A==")).toBe(true);
  });

  it("accepts base64 PNG data URLs", () => {
    expect(isValidBannerUrl("data:image/png;base64,iVBORw==")).toBe(true);
  });

  it("accepts base64 WebP data URLs", () => {
    expect(isValidBannerUrl("data:image/webp;base64,UklGRg==")).toBe(true);
  });

  it("rejects http URLs", () => {
    expect(isValidBannerUrl("http://example.com/banner.jpg")).toBe(false);
  });

  it("rejects plain text", () => {
    expect(isValidBannerUrl("not-a-url")).toBe(false);
  });

  it("rejects data URLs with unsupported MIME type", () => {
    expect(isValidBannerUrl("data:text/html;base64,PHNjcmlwdA==")).toBe(false);
  });
});
