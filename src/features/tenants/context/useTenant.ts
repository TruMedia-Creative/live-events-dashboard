import { useContext } from "react";
import { TenantContext, type TenantContextValue } from "./tenantContextValue";

export function useTenant(): TenantContextValue {
  return useContext(TenantContext);
}
