import type { Event } from '@eventudio/contracts'

export interface EventRepository {
  list(): Promise<Event[]>
  create(event: Event): Promise<Event>
}

export interface DatabaseClient {
  events: EventRepository
}
