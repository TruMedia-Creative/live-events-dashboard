import { createContext } from "react";
import type { Tenant } from "../model";

export interface TenantContextValue {
  tenant: Tenant | null;
  loading: boolean;
}

export const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  loading: true,
});
