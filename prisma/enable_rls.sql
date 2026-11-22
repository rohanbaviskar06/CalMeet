-- ==============================================================================
-- Supabase Security Advisor Remediation: Enable Row Level Security (RLS)
-- ==============================================================================
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run.
-- This protects all tables and sensitive columns from unauthorized public PostgREST 
-- API access while allowing the Prisma ORM connection full backend access.
-- ==============================================================================

-- Core Authentication & Users
ALTER TABLE IF EXISTS "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "VerificationToken" ENABLE ROW LEVEL SECURITY;

-- Scheduling & Availability
ALTER TABLE IF EXISTS "Availability" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "EventType" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Booking" ENABLE ROW LEVEL SECURITY;

-- Integrations, Workflows & Routing
ALTER TABLE IF EXISTS "Integration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "RoutingForm" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Workflow" ENABLE ROW LEVEL SECURITY;

-- Teams & Organizations
ALTER TABLE IF EXISTS "Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "TeamMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "TeamInvitation" ENABLE ROW LEVEL SECURITY;

-- Marketing & Developers
ALTER TABLE IF EXISTS "NewsletterSubscriber" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Webhook" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "ApiKey" ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- Note on RLS Enforcement:
-- Prisma connects via the PostgreSQL connection pooler using the `postgres` user 
-- (superuser/service role) which bypasses RLS by default.
-- Enabling RLS above ensures that anonymous or public API requests via Supabase's
-- PostgREST interface cannot read or mutate any user data without explicit policies.
-- ==============================================================================
