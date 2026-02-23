import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Tenant } from "../model";
import { getTenantBySlug } from "../../../lib/api/mock";

interface TenantContextValue {
  tenant: Tenant | null;
  loading: boolean;
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  loading: true,
});

function resolveSlugFromHostname(): string | null {
  const hostname = window.location.hostname;
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
    const resolvedSlug = slug ?? resolveSlugFromHostname() ?? "showpro";
    getTenantBySlug(resolvedSlug).then((t) => {
      setTenant(t ?? null);
      setLoading(false);
    });
  }, [slug]);

  return (
    <TenantContext value={{ tenant, loading }}>{children}</TenantContext>
  );
}

export function useTenant(): TenantContextValue {
  return useContext(TenantContext);
}
