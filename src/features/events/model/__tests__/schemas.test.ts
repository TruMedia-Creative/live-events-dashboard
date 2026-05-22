import { describe, it, expect } from "vitest";
import {
  streamConfigSchema,
  eventResourceSchema,
  speakerSchema,
  createEventSchema,
} from "../schemas";

describe("streamConfigSchema", () => {
  it("parses a valid youtube stream config", () => {
    const result = streamConfigSchema.safeParse({
      provider: "youtube",
      embedUrl: "https://youtube.com/embed/abc",
    });
    expect(result.success).toBe(true);
  });

  it("parses a valid vimeo stream config", () => {
    const result = streamConfigSchema.safeParse({
      provider: "vimeo",
      embedUrl: "https://player.vimeo.com/video/123",
      isLive: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid provider", () => {
    const result = streamConfigSchema.safeParse({
      provider: "twitch",
      embedUrl: "https://twitch.tv/embed",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an http embedUrl (zod url validates format only)", () => {
    const result = streamConfigSchema.safeParse({
      provider: "youtube",
      embedUrl: "http://youtube.com/embed/abc",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing embedUrl", () => {
    const result = streamConfigSchema.safeParse({ provider: "youtube" });
    expect(result.success).toBe(false);
  });
});

describe("eventResourceSchema", () => {
  it("parses a valid resource", () => {
    const result = eventResourceSchema.safeParse({
      id: "r1",
      name: "Slide Deck",
      url: "https://example.com/deck.pdf",
      type: "pdf",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = eventResourceSchema.safeParse({
      id: "r1",
      name: "",
      url: "https://example.com/deck.pdf",
      type: "pdf",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-url resource URL", () => {
    const result = eventResourceSchema.safeParse({
      id: "r1",
      name: "Deck",
      url: "not-a-url",
      type: "pdf",
    });
    expect(result.success).toBe(false);
  });
});

describe("speakerSchema", () => {
  it("parses a valid speaker", () => {
    const result = speakerSchema.safeParse({
      id: "s1",
      name: "Jane Doe",
      title: "CTO",
      company: "Acme Corp",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional headshot and bio", () => {
    const result = speakerSchema.safeParse({
      id: "s1",
      name: "Jane Doe",
      title: "CTO",
      company: "Acme Corp",
      headshotUrl: "https://example.com/headshot.jpg",
      bio: "Jane is a seasoned engineer.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = speakerSchema.safeParse({
      id: "s1",
      name: "",
      title: "CTO",
      company: "Acme Corp",
    });
    expect(result.success).toBe(false);
  });
});

describe("createEventSchema", () => {
  const validEvent = {
    title: "Tech Summit 2025",
    slug: "tech-summit-2025",
    status: "draft",
    startAt: "2025-10-01T09:00:00Z",
    endAt: "2025-10-01T17:00:00Z",
    timezone: "America/New_York",
    description: "Annual tech conference",
    resources: [],
    speakers: [],
    sessions: [],
  };

  it("parses a minimal valid event", () => {
    const result = createEventSchema.safeParse(validEvent);
    expect(result.success).toBe(true);
  });

  it("accepts all valid statuses", () => {
    for (const status of ["draft", "published", "archived"]) {
      expect(
        createEventSchema.safeParse({ ...validEvent, status }).success,
      ).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    const result = createEventSchema.safeParse({
      ...validEvent,
      status: "cancelled",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty title", () => {
    const result = createEventSchema.safeParse({ ...validEvent, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects empty slug", () => {
    const result = createEventSchema.safeParse({ ...validEvent, slug: "" });
    expect(result.success).toBe(false);
  });

  it("accepts optional venue field", () => {
    const result = createEventSchema.safeParse({
      ...validEvent,
      venue: "Convention Center",
    });
    expect(result.success).toBe(true);
  });
});
