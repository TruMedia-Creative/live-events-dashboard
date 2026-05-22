import type { EventData } from "../../../features/events/model";
import type { CreateEventInput } from "../../../features/events/model";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function getEvents(tenantId: string): Promise<EventData[]> {
  return request<EventData[]>(`/api/tenants/${tenantId}/events`);
}

export async function getEventBySlug(
  tenantId: string,
  slug: string,
): Promise<EventData | undefined> {
  return request<EventData | undefined>(
    `/api/tenants/${tenantId}/events/by-slug/${slug}`,
  );
}

export async function getEventById(
  id: string,
): Promise<EventData | undefined> {
  return request<EventData | undefined>(`/api/events/${id}`);
}

export async function createEvent(
  tenantId: string,
  data: CreateEventInput,
): Promise<EventData> {
  return request<EventData>(`/api/tenants/${tenantId}/events`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEvent(
  id: string,
  data: Partial<CreateEventInput>,
): Promise<EventData> {
  return request<EventData>(`/api/events/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(id: string): Promise<void> {
  await request<void>(`/api/events/${id}`, { method: "DELETE" });
}
