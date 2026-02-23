import type { EventData } from "../../../features/events/model";
import type { CreateEventInput } from "../../../features/events/model";
import { mockEvents } from "./data";

const events: EventData[] = [...mockEvents];

function delay(ms = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getEvents(tenantId: string): Promise<EventData[]> {
  await delay();
  return events.filter((e) => e.tenantId === tenantId);
}

export async function getEventBySlug(
  tenantId: string,
  slug: string,
): Promise<EventData | undefined> {
  await delay();
  return events.find((e) => e.tenantId === tenantId && e.slug === slug);
}

export async function getEventById(
  id: string,
): Promise<EventData | undefined> {
  await delay();
  return events.find((e) => e.id === id);
}

export async function createEvent(
  tenantId: string,
  data: CreateEventInput,
): Promise<EventData> {
  await delay();
  const event: EventData = {
    ...data,
    id: crypto.randomUUID(),
    tenantId,
  };
  events.push(event);
  return event;
}

export async function updateEvent(
  id: string,
  data: Partial<CreateEventInput>,
): Promise<EventData> {
  await delay();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error(`Event not found: ${id}`);
  }
  events[index] = { ...events[index], ...data };
  return events[index];
}

export async function deleteEvent(id: string): Promise<void> {
  await delay();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error(`Event not found: ${id}`);
  }
  events.splice(index, 1);
}
