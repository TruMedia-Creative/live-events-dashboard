import { z } from "zod/v4";

export const streamProviderSchema = z.enum(["youtube", "vimeo", "other"]);

export const streamConfigSchema = z.object({
  provider: streamProviderSchema,
  embedUrl: z.url(),
  isLive: z.boolean().optional(),
  replayUrl: z.url().optional(),
});

export const eventResourceSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  url: z.url(),
  type: z.string().min(1),
});

export const speakerSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  company: z.string().min(1),
  headshotUrl: z.url().optional(),
  bio: z.string().optional(),
});

export const sessionSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  startAt: z.string().min(1),
  endAt: z.string().min(1),
  description: z.string().optional(),
  speakerName: z.string().optional(),
});

export const createEventSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]),
  startAt: z.string().min(1),
  endAt: z.string().min(1),
  timezone: z.string().min(1),
  venue: z.string().optional(),
  description: z.string().min(1),
  bannerUrl: z.url().optional(),
  stream: streamConfigSchema.optional(),
  resources: eventResourceSchema.array(),
  speakers: speakerSchema.array(),
  sessions: sessionSchema.array(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = createEventSchema.partial();

export type UpdateEventInput = z.infer<typeof updateEventSchema>;
