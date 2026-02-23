import type { Tenant } from "../../../features/tenants/model";
import { mockTenants } from "./data";

const tenants: Tenant[] = [...mockTenants];

function delay(ms = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getTenants(): Promise<Tenant[]> {
  await delay();
  return [...tenants];
}

export async function getTenantBySlug(
  slug: string,
): Promise<Tenant | undefined> {
  await delay();
  return tenants.find((t) => t.slug === slug);
}

export async function getTenantById(
  id: string,
): Promise<Tenant | undefined> {
  await delay();
  return tenants.find((t) => t.id === id);
}
