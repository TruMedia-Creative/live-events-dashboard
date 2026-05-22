/**
 * Unified API entry point. Set VITE_API_MODE=real to route calls to the
 * fetch-based real layer; defaults to the localStorage-backed mock layer.
 */
import * as mockEvents from "./mock/events";
import * as mockTenants from "./mock/tenants";
import * as realEvents from "./real/events";
import * as realTenants from "./real/tenants";

const useReal = (import.meta.env.VITE_API_MODE as string | undefined) === "real";

const eventsApi = useReal ? realEvents : mockEvents;
const tenantsApi = useReal ? realTenants : mockTenants;

export const getEvents = eventsApi.getEvents;
export const getEventBySlug = eventsApi.getEventBySlug;
export const getEventById = eventsApi.getEventById;
export const createEvent = eventsApi.createEvent;
export const updateEvent = eventsApi.updateEvent;
export const deleteEvent = eventsApi.deleteEvent;

export const getTenants = tenantsApi.getTenants;
export const getTenantBySlug = tenantsApi.getTenantBySlug;
export const getTenantById = tenantsApi.getTenantById;
