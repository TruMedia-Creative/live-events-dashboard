import type { Tenant } from "../../../features/tenants/model";

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

export async function getTenants(): Promise<Tenant[]> {
  return request<Tenant[]>("/api/tenants");
}

export async function getTenantBySlug(
  slug: string,
): Promise<Tenant | undefined> {
  return request<Tenant | undefined>(`/api/tenants/by-slug/${slug}`);
}

export async function getTenantById(
  id: string,
): Promise<Tenant | undefined> {
  return request<Tenant | undefined>(`/api/tenants/${id}`);
}
