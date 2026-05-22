import { z } from 'zod'

export const eventStatusSchema = z.enum(['draft', 'published', 'archived'])

export const eventSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  title: z.string().min(1),
  slug: z.string().min(1),
  startAt: z.string(),
  endAt: z.string(),
  timezone: z.string(),
  venue: z.string(),
  description: z.string(),
  status: eventStatusSchema,
})

export type EventStatus = z.infer<typeof eventStatusSchema>
export type Event = z.infer<typeof eventSchema>
