import type { Event } from '@eventudio/contracts'
import type { DatabaseClient } from '../types'

export async function listEvents(db: DatabaseClient): Promise<Event[]> {
  return db.events.list()
}

export async function createEvent(db: DatabaseClient, event: Event): Promise<Event> {
  return db.events.create(event)
}
