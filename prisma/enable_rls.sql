Itachi Uchiha
Profile
General
Calendars
Conferencing
Appearance
Out of office
Push notifications
Refer and earn
Security
Password
Two factor auth
Compliance
Billing
Manage billing
Plans
Developer
Webhooks
API keys-- ==============================================================================
-- Supabase Security Advisor Remediation: Enable Row Level Security (RLS)
-- ==============================================================================
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run.
-- This protects all tables and sensitive columns (passwords, tokens) from public 
-- PostgREST API access while allowing Prisma ORM full access.

ALTER TABLE IF EXISTS "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Availability" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "EventType" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Integration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "RoutingForm" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Workflow" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "TeamMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "TeamInvitation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "NewsletterSubscriber" ENABLE ROW LEVEL SECURITY;
