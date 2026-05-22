import type { Event } from '@eventudio/contracts'
import type { EventRepository } from '../types'

export function createMemoryEventRepository(seed: Event[] = []): EventRepository {
  const state = [...seed]

  return {
    async list() {
      return [...state]
    },
    async create(event: Event) {
      state.push(event)
      return event
    },
  }
}
