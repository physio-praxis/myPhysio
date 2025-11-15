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
  - Fields: `customerId` (serial PK), `firstName`, `lastName`, `email`, `phoneNumber`, `street`, `additionalAddress`, `postalCode`, `city`, `country`, `createdAt`
  - Indexes on `firstName`, `lastName`, `email`, `phoneNumber`, `street`, `city` for search performance
  - All contact and address fields are nullable except `customerId` and `createdAt`
  - Address is stored as five separate optional fields instead of a single combined field
- `customer_consent` - GDPR consent files stored in Supabase Storage
- `pet` - Animals belonging to customers
- `species` - Reference table for animal types
- `treatment` - Treatment catalog
- `pet_treatment` - Links pets to treatments and invoices
- `invoice` - Billing records

**Views**:

- `customer_search_view` - Optimized for search with pet info aggregated
  - Exposes `firstName` and `lastName` separately for search queries
  - Includes all five address fields: `street`, `additionalAddress`, `postalCode`, `city`, `country`
  - Search queries use ILIKE on both `firstName` and `lastName` independently
- `customer_details_view` - Full customer details with pets array and last 5 treatments (JSON)
  - Includes `firstName` and `lastName` fields
  - Includes all five address fields for complete customer information

**Repositories**: Database queries are organized in `src/lib/server/db/repos/` (e.g., `customerRepo.ts`)

**Customer Repository Pattern** (`src/lib/server/db/repos/customerRepo.ts`):

- `createCustomer()` - Accepts `firstName` and `lastName` as separate required fields, plus five optional address fields (`street`, `additionalAddress`, `postalCode`, `city`, `country`)
- `updateCustomer()` - Updates customer with all name and address fields in `UpdateCustomerInput` type
- Type definitions in `src/lib/types/customerTypes.ts` include `firstName`, `lastName`, and all five address fields across all customer-related types (CustomerDetails, UpdateCustomerInput, CustomerSearchItem)

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
	firstName: name, // min 2 chars, max 120, trimmed - REQUIRED
	lastName: name, // min 2 chars, max 120, trimmed - REQUIRED
	email: email.optional().or(z.literal('')),
	phone: phone.optional().or(z.literal('')),
	street: street.optional().or(z.literal('')), // min 3 chars, max 200
	additionalAddress: additionalAddress.optional().or(z.literal('')), // max 100
	postalCode: postalCode.optional().or(z.literal('')), // 4-10 digits
	city: city.optional().or(z.literal('')), // min 2 chars, max 100
	country: country.optional().or(z.literal('')) // min 2 chars, max 100
});
```

**Required Fields**: `firstName` and `lastName` are the only required fields. All address fields are optional.

**Display Patterns**:

Name display - concatenates first and last name:

```svelte
<h4>
	{customerSearchItem.customer.firstName || '---'}
	{customerSearchItem.customer.lastName || '---'}
</h4>
```

Address display - combines city and postal code (from `CustomerViewCard.svelte`):

```svelte
<span>
	{#if customerSearchItem.customer.city}
		{customerSearchItem.customer.postalCode || ''} {customerSearchItem.customer.city}
	{:else}
		---
	{/if}
</span>
```

**Form UI Pattern** (`/app/customer/add`, `/app/customer/[customerId]/edit`):

Address fields are displayed in a specific layout with dedicated icons:

- `street` - Icon: Route (Lucide) - Placeholder: "Straße und Hausnummer"
- `additionalAddress` - Icon: MapPinPlus - Placeholder: "Zusatz (Wohnung, Etage, etc..)"
- `city` and `postalCode` - Side-by-side layout with 2fr:1fr grid ratio
  - `city` (first) - Icon: Building2 - Placeholder: "Stadt"
  - `postalCode` (second) - Icon: Mailbox (hidden on mobile) - Placeholder: "PLZ"
- `country` - Icon: Earth - Placeholder: "Land"

The postal code icon is hidden on mobile (`hidden md:flex`) to save space while maintaining a clean layout.

### File Uploads

Customer consent files are uploaded to Supabase Storage using `supabaseAdmin` client. Metadata (SHA-256 hash, size, mime type) is stored in `customer_consent` table. The `isLatest` flag marks the current active consent.

### Testing Database

Tests use PGlite (in-memory PostgreSQL) initialized in `src/lib/testing/setupDb.ts`. Each test file can call `makeTestDb()` to get a fresh database instance with the full schema applied via Drizzle migrations.

### Database Seeding

The seed script (`scripts/seed.ts`) generates test data including customers with separate `firstName` and `lastName` fields, plus structured address data using Faker.js:

```typescript
const customersToInsert: InsertCustomer[] = Array.from({ length: count }, () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  phoneNumber: faker.phone.number(),
  street: faker.location.streetAddress(),
  additionalAddress: faker.helpers.maybe(() => `Wohnung ${faker.number.int({ min: 1, max: 99 })}`, { probability: 0.3 }) ?? null,
  postalCode: faker.location.zipCode('####'),
  city: faker.location.city(),
  country: 'Österreich',
  createdAt: new Date(...)
}));
```

This generates realistic German/Austrian address data with:

- Street addresses from Faker
- Optional additional address info (30% probability) like "Wohnung 42"
- 4-digit postal codes matching Austrian format
- Random city names
- Default country set to "Österreich" (Austria)

Consent file generation also uses both name fields to create realistic test files with customer names embedded in the file content.

### Error Handling

**Server-Side Pattern** (`+page.server.ts`):

Form actions validate using Zod schemas and return errors as `Record<string, string>`:

```typescript
const parsed = CustomerSchema.safeParse(raw);

if (!parsed.success) {
	const errors: Record<string, string> = {};
	for (const issue of parsed.error.issues) {
		const issueKey = String(issue.path[0] ?? '_');
		if (!errors[issueKey]) errors[issueKey] = issue.message;
	}
	return fail(400, { values: raw, errors });
}
```

Global errors (server failures, database errors) use the special `_global` key:

```typescript
return fail(500, {
	values: raw,
	errors: {
		_global: 'Unerwarteter Fehler. Bitte später erneut versuchen.'
	} as Record<string, string>
});
```

**Client-Side Pattern** (`+page.svelte`):

Forms must follow this consistent error handling pattern:

1. **Error Object Setup**: Extract errors from unified form state using dot notation

```svelte
<script>
	const unifiedForm = $derived(form ?? data.form ?? {});
	const errors = $derived(unifiedForm?.errors ?? {});
</script>
```

2. **Global Error Display**: Show `_global` errors at top of form

```svelte
{#if errors._global}
	<div class="w-full max-w-lg rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
		{errors._global}
	</div>
{/if}
```

3. **Field-Level Errors**: Use consistent pattern for each input field

```svelte
<!-- Input with ARIA attributes -->
<input
	class="ig-input"
	type="text"
	name="firstName"
	placeholder="Vorname"
	required
	value={values.firstName ?? ''}
	aria-invalid={Boolean(errors.firstName)}
	aria-describedby="err-firstName"
/>

<!-- Error message paragraph -->
{#if errors.firstName}
	<p id="err-firstName" class="w-full max-w-lg text-xs text-red-600">{errors.firstName}</p>
{/if}
```

**Critical Rules**:

- **Always use dot notation** for error access: `errors.firstName`, `errors.additionalAddress`, `errors.city` (never bracket notation like `errors['firstName']`)
- **Error paragraph IDs must match field names exactly**: `id="err-{fieldName}"` (e.g., `id="err-firstName"`, `id="err-additionalAddress"`)
- **ARIA attributes are required** for accessibility:
  - `aria-invalid={Boolean(errors.fieldName)}` - Indicates validation state
  - `aria-describedby="err-fieldName"` - Links input to error message
- **Maintain consistency across all forms** - All forms in the application must follow this identical pattern

This standardization ensures:

- Predictable error handling across the application
- Proper accessibility support for screen readers
- Easier maintenance and debugging
- Consistent user experience

### Unsaved Changes Protection

**Status**: ✅ Completed (as of 2025-11-12)

The application implements a reusable pattern to protect users from losing unsaved form data when navigating away from pages.

**Implementation Components**:

1. **Utility**: `src/lib/utils/useUnsavedChanges.svelte.ts`
   - Store-based composable (returns Svelte store with custom methods)
   - Intercepts SvelteKit navigation via `beforeNavigate`
   - Intercepts browser navigation (tab close, refresh) via `beforeunload` event
   - Returns a store extending `Readable<boolean>` with `confirmLeave()` and `cancelLeave()` methods
   - Uses `goto()` to resume cancelled navigation after user confirmation
   - Filters out `navigation.type === 'leave'` to prevent double dialogs on browser refresh

2. **Modal Component**: `src/lib/components/UnsavedChangesModal.svelte`
   - Reusable Skeleton UI Modal for confirmation dialog
   - Uses `{#snippet content()}` pattern (Skeleton UI v3 requirement)
   - Props: `open` (boolean), `onConfirm` (function), `onCancel` (function)
   - German text: "Ungespeicherte Änderungen" with danger-styled "Verlassen" button
   - Handles both explicit cancel and backdrop/ESC close via `onOpenChange`
   - Positioned center screen with fade transitions

**Usage Pattern**:

```svelte
<script lang="ts">
	import { useUnsavedChanges } from '$lib/utils/useUnsavedChanges.svelte';
	import UnsavedChangesModal from '$lib/components/UnsavedChangesModal.svelte';

	// Define initial values (empty for add forms, loaded data for edit forms)
	const initialValues = {
		firstName: '',
		lastName: '',
		email: ''
		// ... all form fields
	};

	// Track current form values
	let currentValues = $state({ ...initialValues });

	// Sync with server validation errors
	$effect(() => {
		if (unifiedForm?.values && Object.keys(unifiedForm.values).length > 0) {
			currentValues = {
				firstName: unifiedForm.values.firstName ?? '',
				lastName: unifiedForm.values.lastName ?? ''
				// ... all fields
			};
		}
	});

	// Check if form has actual changes from initial state
	const formHasChanged = $derived(
		Object.entries(currentValues).some(([key, value]) => {
			const initialValue = initialValues[key as keyof typeof initialValues];
			return value !== initialValue;
		})
	);

	// Exclude changes during submission
	const hasUnsavedChanges = $derived(formHasChanged && !isPending);

	// Setup protection (returns a store)
	const unsavedChanges = useUnsavedChanges(() => hasUnsavedChanges);
</script>

<form
	use:enhance={() => {
		isPending = true;
		return async ({ result }) => {
			isPending = false;
			if (result.type === 'redirect') {
				currentValues = { ...initialValues }; // Reset before navigation
				goto(resolve(result.location, {}), { replaceState: true });
				return;
			}
			await applyAction(result);
		};
	}}
>
	<!-- Each input needs oninput handler to update currentValues -->
	<input
		name="firstName"
		value={currentValues.firstName}
		oninput={(e) => {
			currentValues.firstName = e.currentTarget.value;
		}}
	/>
	<!-- ... other fields -->
</form>

<UnsavedChangesModal
	open={$unsavedChanges}
	onConfirm={unsavedChanges.confirmLeave}
	onCancel={unsavedChanges.cancelLeave}
/>
```

**Implementation Status**:

- ✅ Utility and modal components created
- ✅ `/app/customer/add` - Customer creation form (completed)
- ✅ `/app/customer/[customerId]/edit` - Customer edit form (completed)

**Pages that Don't Need Protection**:

- `/app/customer` - Search/filter only (read-only)
- `/app/customer/[customerId]` - Delete confirmation (not data entry)
- `/auth/login` - Low priority (transient credentials)

**Key Implementation Details**:

- **Store-based reactivity**: Uses Svelte stores (`writable`) instead of `$state` runes for cross-component reactivity
- **Actual change detection**: Compares current values against initial values, not just "form was touched"
- **Per-field tracking**: Each input has `oninput` handler updating `currentValues` state
- **Server sync**: `$effect` syncs `currentValues` when server returns validation errors
- **Reset on success**: Must reset `currentValues = { ...initialValues }` before redirect to prevent false warning
- **Exclude during submit**: Use `hasUnsavedChanges = formHasChanged && !isPending` to avoid warning during submission
- **Browser navigation**: Shows browser's default dialog on refresh/close (cannot be customized for security)
- **Internal navigation**: Shows custom modal for SvelteKit navigation (links, `goto()`)
- **Navigation type filtering**: Ignores `navigation.type === 'leave'` to prevent modal showing after browser dialog
- **Modal access**: Use `$unsavedChanges` (store auto-subscribe) for `open` prop, and `unsavedChanges.confirmLeave/cancelLeave` for handlers

**Technical Notes**:

- `$state` runes don't maintain reactivity when returned from utility functions
- Svelte stores properly propagate reactivity across component boundaries
- `useUnsavedChanges` returns a custom store interface: `Readable<boolean> & { confirmLeave, cancelLeave }`
- The `allowNavigation` flag prevents re-triggering `beforeNavigate` when executing confirmed navigation

**Future Enhancements** (optional):

1. LocalStorage auto-save for draft recovery
2. Apply to future forms (pet add/edit, treatment, invoice) when implemented
### Custom Error Pages

The application has custom error pages (`src/routes/+error.svelte`) for 404 and 500 errors with veterinary-themed quotes and images.

**Implementation Pattern**:

```typescript
const errors404 = [
	{
		quote: 'Sitz, Platz... Seite? - Leider nicht gefunden.',
		image: '/images/error/404-1.jpg'
	}
	// ... more error objects
];

const errors500 = [
	{
		quote: 'Wuff... hier ist was schiefgelaufen. Unser Server hat wohl den Ball nicht gefangen.',
		image: '/images/error/500-1.jpg'
	}
	// ... more error objects
];

const errorIs404 = page.status === 404;
const array = errorIs404 ? errors404 : errors500;
const index = Math.floor(Math.random() * array.length);

let selectedError = $state(array[index]);
```

**Key Points**:

- Quote and image are stored together in objects to ensure they're always paired correctly
- Random selection happens once at component initialization using `$state`
- Images are stored in `static/images/error/` directory
- 404 errors show "Zurück zur Startseite" button linking to `/app`
- 500 errors show "Problem melden" button linking to GitHub issues

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
