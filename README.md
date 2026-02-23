# Live Event Web App

A multi-tenant event web app for AV production companies.
Clients can create branded event landing pages (livestream + resources) through a self-serve portal.
Admins can manage tenants, clients, events, and publishing.

## Core Features (MVP)
- Client dashboard: create/edit events
- Auto-generated event landing pages (public share link)
- Stream embeds (YouTube/Vimeo/Other)
- Resource downloads (PDFs, slide decks, links)
- Admin dashboard: manage tenants + events + publish state
- Multi-tenant foundation (tenant from hostname or route)

## Tech Stack
- Vite + React + TypeScript
- React Router
- Zod (validation)
- (Optional) React Hook Form

## Getting Started

### Prereqs
- Node.js 18+ (20+ preferred)

### Install
```bash
pnpm i