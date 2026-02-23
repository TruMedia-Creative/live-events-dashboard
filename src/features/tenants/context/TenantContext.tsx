import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Tenant } from "../model";
import { getTenantBySlug } from "../../../lib/api/mock";
import { TenantContext } from "./tenantContextValue";

export type { TenantContextValue } from "./tenantContextValue";
export { TenantContext } from "./tenantContextValue";

const FALLBACK_TENANT_SLUG = "Eventudio";

function resolveSlugFromHostname(): string | null {
  const hostname = window.location.hostname;
  const blockedHosts = ["localhost", "127.0.0.1"];
  const blockedSuffixes = ["github.io"];

  if (blockedHosts.includes(hostname)) {
    return null;
  }

  if (blockedSuffixes.some((suffix) => hostname.endsWith(suffix))) {
    return null;
  }

  const parts = hostname.split(".");
  if (parts.length >= 2 && parts[0] !== "www") {
    return parts[0];
  }
  return null;
}

export function TenantProvider({
  slug,
  children,
}: {
  slug?: string;
  children: ReactNode;
}) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolvedSlug = slug ?? resolveSlugFromHostname() ?? FALLBACK_TENANT_SLUG;
    getTenantBySlug(resolvedSlug).then((t) => {
      setTenant(t ?? null);
      setLoading(false);
    });
  }, [slug]);

  return (
    <TenantContext.Provider value={{ tenant, loading }}>{children}</TenantContext.Provider>
  );
}
