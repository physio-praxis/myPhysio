# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyPhysio is a physiotherapy practice management application for veterinary practices. Built with SvelteKit 2, it manages customers (pet owners), their pets, treatments, and invoices. The app uses PostgreSQL via Drizzle ORM and Supabase for authentication and file storage.

## Working with Claude Code

**Default Mode: Readonly Advisor**

Claude should act as a readonly advisor for this project by default:

- **Suggest** changes, improvements, and implementation plans
- **Review** and validate implementations
- **Guide** through step-by-step processes
- **NEVER** write, edit, or modify files directly unless explicitly requested

**Exception**: Claude may perform write operations (Edit, Write, Bash commands) ONLY when the developer explicitly requests it (e.g., "please implement this", "add this for me", "write this code").

## Development Commands

### Running the Application

```bash
npm run dev              # Start dev server
npm run dev -- --open    # Start dev server and open browser
npm run build            # Production build
npm run preview          # Preview production build
```

### Type Checking & Linting

```bash
npm run check            # Type check with svelte-check (fails on warnings)
npm run check:watch      # Type check in watch mode
npm run lint             # Run prettier check + eslint
npm run format           # Format code with prettier
```

### Testing

```bash
npm run test             # Run all tests once
npm run test:unit        # Run tests in watch mode
npm run test:ci          # Run tests with coverage for CI

# Run specific test file
npx vitest run path/to/file.test.ts

# Run tests for a specific project (client or server)
npx vitest run --project=server
npx vitest run --project=client
```

The test suite uses Vitest with two projects:

- **server**: Node environment tests (src/lib/server, repos, utilities) using PGlite for in-memory PostgreSQL
- **client**: Browser tests (\*.svelte.test/spec files) using Playwright with Chromium

### Database Commands

```bash
npm run db:push          # Push schema changes to database (dev)
npm run db:generate      # Generate migration files
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio GUI
npm run db:seed          # Seed database with test data
npm run db:seed:wipe     # Wipe and reseed database
```

## Architecture

### Authentication & Session Management

The app uses a custom session system built on top of Supabase Auth:

1. **Supabase handles OAuth/password authentication** → returns user ID
2. **Custom session system** (`src/lib/server/session.ts`):
   - Generates session tokens (32-byte random, base64url encoded)
   - Stores hashed tokens (SHA-256) in `user_session` table
   - Sessions expire after 7 days, auto-refresh if <1 day remains
   - Cookie: `myphysio_app_session` (httpOnly, sameSite: lax)

3. **Global auth check** (`src/hooks.server.ts`):
   - Every request reads session from cookie
   - Populates `event.locals.session` and `event.locals.user`
   - Redirects unauthenticated users to `/auth/login` (except `/auth/*` routes)

### Database Layer

- **ORM**: Drizzle ORM with PostgreSQL
- **Connection**: Production uses `pg` Pool, tests use PGlite (in-memory)
- **Schema**: Single source of truth in `src/lib/server/db/schema.ts`

**Key Tables**:

- `auth_user`, `user_session` - Authentication
- `customer` - Pet owners with contact info
  - Fields: `customerId` (serial PK), `firstName`, `lastName`, `email`, `phoneNumber`, `address`, `createdAt`
  - Indexes on `firstName`, `lastName`, `email`, `phoneNumber` for search performance
  - All contact fields are nullable except `customerId` and `createdAt`
- `customer_consent` - GDPR consent files stored in Supabase Storage
- `pet` - Animals belonging to customers
- `species` - Reference table for animal types
- `treatment` - Treatment catalog
- `pet_treatment` - Links pets to treatments and invoices
- `invoice` - Billing records

**Views**:

- `customer_search_view` - Optimized for search with pet info aggregated
  - Exposes `firstName` and `lastName` separately for search queries
  - Search queries use ILIKE on both `firstName` and `lastName` independently
- `customer_details_view` - Full customer details with pets array and last 5 treatments (JSON)
  - Includes `firstName` and `lastName` fields

**Repositories**: Database queries are organized in `src/lib/server/db/repos/` (e.g., `customerRepo.ts`)

**Customer Repository Pattern** (`src/lib/server/db/repos/customerRepo.ts`):

- `createCustomer()` - Accepts `firstName` and `lastName` as separate required fields
- `updateCustomer()` - Updates customer with `firstName` and `lastName` in `UpdateCustomerInput` type
- Type definitions in `src/lib/types/customerTypes.ts` include `firstName` and `lastName` across all customer-related types

### Frontend Structure

- **Framework**: Svelte 5 with SvelteKit 2 (file-based routing)
- **Styling**: Tailwind CSS 4 + Skeleton UI components
- **Icons**: Lucide Svelte
- **Forms**: Zod validation schemas in `src/lib/validation/`

**Key Routes**:

- `/auth/login` - Public login page
- `/app/*` - Protected app routes (requires session)
  - `/app/customer` - Customer list/search
  - `/app/customer/add` - Add new customer
  - `/app/customer/[customerId]` - Customer details
  - `/app/customer/[customerId]/edit` - Edit customer
  - `/app/customer/[customerId]/consent` - Upload GDPR consent
  - `/app/settings` - Application settings and version display

**State Management**:

- Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Responsive design handled via Tailwind CSS classes (no JavaScript breakpoint detection)

**Navigation Pattern**:

The app uses responsive navigation (`src/lib/components/NavBar.svelte`):

- **Desktop**: `Navigation.Rail` - Vertical sidebar with all menu items
- **Mobile**: `Navigation.Bar` - Bottom bar with icon-only tiles
  - Primary items: First 4 items from navigation array shown directly in bottom bar
  - Secondary items: Remaining items accessible via "Mehr" (More) button
  - Overflow menu: Uses Skeleton UI's `Modal` component configured as bottom drawer
  - Pattern scales infinitely - new items automatically appear in "Mehr" menu

**Important**: Skeleton UI v3 doesn't have a separate `Drawer` component. Use `Modal` with bottom positioning (`positionerJustify="justify-end"`, `positionerAlign="items-end"`) and slide-up transitions (`transitionsPositionerIn/Out={{ y: value }}`).

### File Organization

```
src/
├── lib/
│   ├── components/          # Reusable Svelte components
│   ├── server/
│   │   ├── db/
│   │   │   ├── schema.ts    # Drizzle schema (tables, views, relations)
│   │   │   ├── db.ts        # Database connection
│   │   │   └── repos/       # Repository pattern for queries
│   │   ├── session.ts       # Session management
│   │   └── supabase.ts      # Supabase clients (admin, anon)
│   ├── testing/             # Test utilities (testDb, setupDb)
│   ├── types/               # TypeScript types
│   ├── utils/               # Shared utilities
│   └── validation/          # Zod schemas
├── routes/                  # SvelteKit file-based routing
└── hooks.server.ts          # Global request handler
```

## Important Patterns

### URL Resolution

All navigation links use `resolve()` from `$app/paths` to ensure URLs work correctly even when deployed to a subpath:

```svelte
import {resolve} from '$app/paths';

<a href={resolve('/app/customer', {})}>Customer</a>
```

This is required to pass ESLint's `svelte/no-navigation-without-resolve` rule. `Navigation.Tile` components handle this automatically via their `href` prop.

### Responsive Design

The app uses **CSS-only responsive design** with Tailwind's breakpoint classes instead of JavaScript-based breakpoint detection:

```svelte
<!-- Mobile only -->
<div class="block md:hidden">
	<Navigation.Bar>...</Navigation.Bar>
</div>

<!-- Desktop only -->
<div class="hidden md:block">
	<Navigation.Rail>...</Navigation.Rail>
</div>
```

This approach avoids layout shift issues and simplifies state management. The `md:` breakpoint (768px) is used to switch between mobile and desktop layouts.

### Validation

All forms use Zod schemas defined in `src/lib/validation/`. Server actions validate input with these schemas before database operations.

**Customer Validation** (`src/lib/validation/app/customer/customer.schema.ts`):

```typescript
export const CustomerSchema = z.object({
	firstName: name, // min 2 chars, max 120, trimmed
	lastName: name, // min 2 chars, max 120, trimmed
	email: email.optional().or(z.literal('')),
	phone: phone.optional().or(z.literal('')),
	address: address.optional().or(z.literal(''))
});
```

Both `firstName` and `lastName` are required fields. Forms display separate inputs with German labels ("Vorname" and "Nachname").

**Display Pattern**: When displaying customer names in the UI, `firstName` and `lastName` are concatenated:

```svelte
<h4>
	{customerSearchItem.customer.firstName || '---'}
	{customerSearchItem.customer.lastName || '---'}
</h4>
```

This pattern is used throughout components like `CustomerViewCard.svelte` and customer detail pages.

### File Uploads

Customer consent files are uploaded to Supabase Storage using `supabaseAdmin` client. Metadata (SHA-256 hash, size, mime type) is stored in `customer_consent` table. The `isLatest` flag marks the current active consent.

### Testing Database

Tests use PGlite (in-memory PostgreSQL) initialized in `src/lib/testing/setupDb.ts`. Each test file can call `makeTestDb()` to get a fresh database instance with the full schema applied via Drizzle migrations.

### Database Seeding

The seed script (`scripts/seed.ts`) generates test data including customers with separate `firstName` and `lastName` fields using Faker.js:

```typescript
const customersToInsert: InsertCustomer[] = Array.from({ length: count }, () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  phoneNumber: faker.phone.number(),
  address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
  createdAt: new Date(...)
}));
```

Consent file generation also uses both name fields to create realistic test files with customer names embedded in the file content.

### Error Handling

SvelteKit form actions return `{ success: boolean, error?: string }`. Failed actions set form-level errors displayed in the UI.

### Loading Application Metadata

Application version and other build-time metadata from `package.json` can be loaded server-side using Node.js file system APIs:

```typescript
// src/routes/app/settings/+page.server.ts
import { readFileSync } from 'fs';
import { join } from 'path';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));

	return {
		version: packageJson.version
	};
};
```

The loaded data is automatically typed and available in the corresponding `+page.svelte` component via the `data` prop. This pattern is used in the settings page to display the current application version.

## Environment Variables

Required (see `.env.example`):

- `PUBLIC_SUPABASE_URL` - Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only)
- `DATABASE_URL` - PostgreSQL connection string

## Key Dependencies

- **SvelteKit 2** + **Svelte 5** - Framework
- **Drizzle ORM** - Type-safe SQL with PostgreSQL
- **Supabase** - Auth + Storage (not using Supabase DB, just services)
- **Tailwind CSS 4** - Styling
- **Skeleton UI** - Component library
- **Zod** - Schema validation
- **Vitest** - Testing framework
- **PGlite** - In-memory PostgreSQL for tests
- we define types always in the folder src/lib/types and not directly where it is used
- this project all messages (errors or text the user see) will be in german
- don't change code yourself, just guide me through it please
- I am not allowed to use the type any anywhere
