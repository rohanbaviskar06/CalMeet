# CalMeet - Modern SaaS Scheduling Platform

CalMeet is a scheduling and meeting management platform built with Next.js, Prisma, and Tailwind CSS.

---

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & Radix UI
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL (Supabase Connection Pooler supported)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials, Google OAuth, GitHub, Zoom)
- **Email Delivery**: Resend & Nodemailer SMTP fallback
- **Integrations**: Google Calendar, Google Meet, Zoom, Slack, Zapier, Razorpay, Cloudinary

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example environment template:
```bash
cp .env.example .env
```

Set up the key variables in `.env`:
- `DATABASE_URL`: Transaction pooler URL (`port 6543?pgbouncer=true` for Supabase).
- `DIRECT_URL`: Session pooler or direct connection URL (`port 5432`) required by Prisma for migrations.
- `NEXTAUTH_SECRET`: A secure 32+ character random string.
- `NEXTAUTH_URL`: `http://localhost:3000` (or your production origin).
- `ADMIN_EMAILS`: Comma-separated list of authorized administrator email addresses.
- `CRON_SECRET`: Bearer token required for executing `/api/cron/reminders`.
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Required for paid booking and plan upgrade signature verification.

### 3. Database Setup & Migrations
Synchronize your Prisma schema to your database:
```bash
npx prisma db push
```
Or run migrations:
```bash
npx prisma migrate dev
```

### 4. Enable Supabase Row Level Security (RLS)
To protect your database tables against unauthorized public PostgREST API access in Supabase, execute `prisma/enable_rls.sql` in your **Supabase Dashboard > SQL Editor**.

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Security & Architecture Highlights

1. **Authentication & Identity Protection**:
   - Strictly enforced credentials authentication; no password bypasses.
   - User account preservation: Signing up with an existing email returns an explicit error and will never overwrite or cascade-delete existing account records.
   - Dangerous cross-provider account linking (`allowDangerousEmailAccountLinking`) is disabled.
2. **Server-Side Authorization**:
   - Admin actions (`getAdminStats`, `updateUserPlan`, `deleteUser`, etc.) verify admin status via session and database role/email checks.
   - Team operations verify that the target member or invitation belongs strictly to the authorized team.
   - Plan upgrades are enforced on the server and require verified payment transactions.
3. **Booking Concurrency & Validation**:
   - Server-side validation for active status, exact duration, host working hours (in host's IANA timezone), and non-past scheduling.
   - Concurrent double-booking prevention across all host event types executed inside a database transaction.
   - Paid events remain in `PENDING` / `UNPAID` status until payment signatures are verified via HMAC-SHA256.
4. **Timezone & Daylight Saving Time (DST)**:
   - Full DST support powered by `Intl.DateTimeFormat` converting UTC slots into the host's actual local time.
   - Google Calendar free/busy integration checks connected calendars to prevent conflicts.
5. **SSRF & XSS Defenses**:
   - Event descriptions rendered with strict HTML sanitization stripping script tags, iframes, and inline event handlers.
   - Webhook endpoints validate targets to block private subnets, localhost, and cloud metadata services (e.g. `169.254.169.254`).
   - Developer API keys are stored as SHA-256 hashes, displayed only once upon generation, and masked in all UI views.
6. **Deduplicated Reminders**:
   - Automated reminder dispatch checks and updates `[REMINDER_SENT]` markers, preventing duplicate email dispatches.
   - Cron endpoints require `CRON_SECRET` authentication.

---

## Testing & Quality Assurance

### Run Unit Tests
```bash
npm test
```
Executes the native test suite covering authentication, account preservation, team authorization, booking concurrency, payments, timezones, and security defenses.

### Run Linter
```bash
npm run lint
```

### Run Production Build
```bash
npm run build
```

---

## External Integrations & Limitations
- **Google Calendar / Meet & Zoom**: Requires valid OAuth client credentials in `.env`. If not configured, meeting creation falls back gracefully to offline or native CalMeet room links (`/meet/[bookingId]`).
- **Razorpay Payments**: Local testing requires test credentials (`rzp_test_...`). In development without live keys, paid bookings remain in pending status until simulated or verified with test keys.
- **Email Delivery**: Falls back to mock or Resend/Gmail SMTP depending on whether `RESEND_API_KEY` or `SMTP_USER` is configured.
