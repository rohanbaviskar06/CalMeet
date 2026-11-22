# CalMeet Disaster Recovery Runbook & Reliability Guide

## 1. Objectives & Metrics
- **Recovery Point Objective (RPO)**: <= 1 hour (Automated hourly snapshots / transaction logs)
- **Recovery Time Objective (RTO)**: <= 15 minutes (Automated restore verification)
- **Data Integrity Standard**: Cryptographic SHA-256 verification on all backup archives.

---

## 2. Backup Architecture

### Daily / On-Demand Backups
Database backups are generated with atomic snapshots covering all relational entities:
- `User`, `Account`, `Session`, `VerificationToken`
- `EventType`, `Booking`, `Availability`
- `Integration`, `RoutingForm`, `Workflow`
- `Team`, `TeamMember`, `TeamInvitation`
- `Webhook`, `ApiKey`

To execute an on-demand backup:
```bash
node scripts/backup_db.mjs
```
The script writes:
1. `backups/calmeet_backup_<timestamp>.json`
2. `backups/calmeet_backup_<timestamp>.sha256`

---

## 3. Disaster Recovery Testing

To test the restoration readiness and cryptographic integrity of existing archives without touching production data:
```bash
node scripts/test_recovery.mjs
```
The recovery tester performs:
1. **Cryptographic Checksum Verification**: Validates file integrity against SHA-256 signature to prevent corruption or tampering.
2. **Schema & Count Validation**: Checks that all required models and counts exist.
3. **Referential Integrity Audit**: Verifies that foreign keys (`userId`, `eventTypeId`) resolve to valid entities with zero orphaned records.

---

## 4. Emergency Database Restoration Procedure

In the event of an outage or accidental data loss:

1. **Isolate Traffic**:
   Temporarily direct traffic to maintenance page or stop worker cron jobs.
2. **Validate Restoration File**:
   Run `node scripts/test_recovery.mjs` against the backup candidate.
3. **Execute Prisma Seed / Restoration**:
   Use `prisma db seed` or custom restoration script targeting `DIRECT_URL`.
4. **Run Smoke Tests**:
   Execute `npm test` and query `GET /api/health` to confirm `status: "HEALTHY"`.
5. **Resume Normal Traffic**:
   Re-enable DNS and monitor error rates via `src/lib/monitoring.ts` and `GET /api/health`.
