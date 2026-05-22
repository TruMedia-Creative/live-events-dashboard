import { z } from 'zod'

export const eventStatusSchema = z.enum(['draft', 'published', 'archived'])

export const streamSchema = z.object({
  provider: z.enum(['youtube', 'vimeo', 'other']),
  embedUrl: z.string().url(),
  isLive: z.boolean().optional(),
  replayUrl: z.string().url().optional(),
})

export const resourceSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  url: z.string().url(),
  type: z.string().min(1),
})

export const speakerSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  company: z.string().min(1),
  headshotUrl: z.string().url().optional(),
  bio: z.string().optional(),
})

export const eventSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  title: z.string().min(1),
  slug: z.string().min(1),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  timezone: z.string(),
  venue: z.string(),
  description: z.string(),
  status: eventStatusSchema,
  stream: streamSchema,
  resources: z.array(resourceSchema),
  speakers: z.array(speakerSchema),
})

export type EventStatus = z.infer<typeof eventStatusSchema>
export type Stream = z.infer<typeof streamSchema>
export type EventResource = z.infer<typeof resourceSchema>
export type Speaker = z.infer<typeof speakerSchema>
export type Event = z.infer<typeof eventSchema>
