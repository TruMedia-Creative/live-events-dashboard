# Architecture

## Tenant Resolution
Tenant is resolved from:
1) Hostname subdomain: {tenant}.showpro.local
2) Fallback: /t/:tenantSlug

Resolved tenant is stored in a TenantContext and used for:
- Branding/theme
- API scoping
- Route guards

## App Areas
- Client: event CRUD
- Public: event landing pages
- Admin: tenant/client/event management

## Data Access
Until backend exists:
- Use a mock repository layer in src/lib/api/mock/*
- Keep the UI calling interfaces, not implementations