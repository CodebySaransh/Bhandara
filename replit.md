# Bhandara Finder

Bhandara Finder helps people discover verified community Bhandaras near them, then save, share, report, and moderate those invitations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Optional env: `MAP_PROVIDER` — reserved for switching from the default OpenStreetMap raster tiles to another map provider

## Setup & deployment

1. Ensure the Replit PostgreSQL database is provisioned so `DATABASE_URL` is available.
2. Run `pnpm --filter @workspace/db run push` to apply the schema.
3. Start the API with the `artifacts/api-server` workflow and the website with the `artifacts/bhandara-finder` workflow.
4. The API seeds a few sample Bhandaras on an empty database. New submissions start as `pending` and only appear publicly after approval in `/admin`.
5. Publish the project from Replit when it is ready. The development schema is applied to production as part of the Publish flow.

The map uses OpenStreetMap raster tiles and does not require an API key. “Get directions” opens Google Maps using coordinates, so no Google Maps browser key is required for the current implementation.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/bhandara-finder/src/App.tsx` — public discovery, detail, submission, saved, and moderation screens
- `artifacts/bhandara-finder/src/index.css` — saffron, cream, marigold, and leafy-green theme
- `artifacts/api-server/src/routes/bhandaras.ts` — discovery, submissions, favorites, reports, and moderation routes
- `lib/db/src/schema/bhandaras.ts` — PostgreSQL schema for Bhandaras, favorites, and reports
- `lib/api-spec/openapi.yaml` — source of truth for the typed API client and Zod validators

## Architecture decisions

- Public Bhandaras are filtered server-side to approved and non-expired events.
- Favorites use a device key in local storage first, keeping the app usable without account setup while persisting the server-side relationship.
- OpenStreetMap raster tiles avoid a required map API key; Google Maps is used only for outbound directions.
- The admin route is intentionally simple for the first release; add Clerk or another managed auth integration before exposing moderation beyond a trusted deployment.

## Product

- Search by Bhandara name, temple, city, or locality.
- Filter by today, tomorrow, this week, custom date, distance, and nearest/soonest sorting.
- Use browser location permission or enter a city manually.
- View event cards, an interactive raster map, event detail pages, Google Maps directions, and verification status.
- Submit new events into the pending queue, save favorites on the device, and report incorrect/cancelled/duplicate events.
- Review pending submissions from the moderation dashboard and approve, reject, edit, or delete them.

## User preferences

No additional project-specific preferences have been provided.

## Gotchas

- Run API codegen after changing `lib/api-spec/openapi.yaml`; do not hand-edit generated client or Zod files.
- Run `pnpm run typecheck:libs` after changing `lib/db` or generated libraries so leaf packages use fresh declarations.
- The public preview should be checked through the managed workflows, not by running Vite directly without `PORT` and `BASE_PATH`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
