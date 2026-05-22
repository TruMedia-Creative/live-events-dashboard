import type { Event } from '@eventudio/contracts'
import type { EventRepository } from '../types'

export function createMemoryEventRepository(seed: Event[] = []): EventRepository {
  const state = seed.map((event) => structuredClone(event))

  return {
    async list() {
      return state.map((event) => structuredClone(event))
    },
    async create(event: Event) {
      const stored = structuredClone(event)
      state.push(stored)
      return structuredClone(stored)
    },
  }
}
