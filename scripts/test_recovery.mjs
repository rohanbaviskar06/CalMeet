import fs from "fs";
import path from "path";
import crypto from "crypto";

async function testRecovery() {
  const backupDir = path.resolve(process.cwd(), "backups");
  console.log(`[RECOVERY_TEST] Starting disaster recovery verification...`);

  if (!fs.existsSync(backupDir)) {
    console.error(`[RECOVERY_TEST] Backup directory not found at ${backupDir}`);
    process.exit(1);
  }

  // Find latest backup json file
  const files = fs.readdirSync(backupDir).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.error(`[RECOVERY_TEST] No backup files found to test recovery.`);
    process.exit(1);
  }

  files.sort().reverse();
  const latestBackupFile = path.join(backupDir, files[0]);
  const latestHashFile = latestBackupFile.replace(/\.json$/, ".sha256");

  console.log(`[RECOVERY_TEST] Testing restoration candidate: ${latestBackupFile}`);

  // 1. Verify Checksum
  if (!fs.existsSync(latestHashFile)) {
    console.error(`[RECOVERY_TEST] Checksum file missing: ${latestHashFile}`);
    process.exit(1);
  }

  const rawBackup = fs.readFileSync(latestBackupFile, "utf-8");
  const computedHash = crypto.createHash("sha256").update(rawBackup).digest("hex");
  const expectedHash = fs.readFileSync(latestHashFile, "utf-8").trim().split(" ")[0];

  if (computedHash !== expectedHash) {
    console.error(`[RECOVERY_TEST] Checksum verification FAILED!`);
    console.error(`Expected: ${expectedHash}`);
    console.error(`Computed: ${computedHash}`);
    process.exit(1);
  }
  console.log(`[RECOVERY_TEST] Checksum verification passed (SHA-256: ${computedHash})`);

  // 2. Parse and Validate Schema
  let parsed;
  try {
    parsed = JSON.parse(rawBackup);
  } catch (parseErr) {
    console.error(`[RECOVERY_TEST] JSON parsing failed:`, parseErr);
    process.exit(1);
  }

  if (!parsed.version || !parsed.data || !parsed.counts) {
    console.error(`[RECOVERY_TEST] Invalid backup manifest format.`);
    process.exit(1);
  }

  const { users, eventTypes, bookings, accounts, availabilities } = parsed.data;
  console.log(`[RECOVERY_TEST] Restorable entity counts:`);
  console.log(`  - Users: ${users?.length || 0}`);
  console.log(`  - EventTypes: ${eventTypes?.length || 0}`);
  console.log(`  - Bookings: ${bookings?.length || 0}`);
  console.log(`  - Accounts: ${accounts?.length || 0}`);
  console.log(`  - Availabilities: ${availabilities?.length || 0}`);

  // 3. Referential Integrity Check
  const userIds = new Set(users.map((u) => u.id));
  const eventTypeIds = new Set(eventTypes.map((et) => et.id));

  let orphanBookings = 0;
  for (const booking of bookings) {
    if (!eventTypeIds.has(booking.eventTypeId)) {
      orphanBookings++;
    }
  }

  let orphanEventTypes = 0;
  for (const et of eventTypes) {
    if (!userIds.has(et.userId)) {
      orphanEventTypes++;
    }
  }

  console.log(`[RECOVERY_TEST] Referential integrity results:`);
  console.log(`  - Orphan EventTypes: ${orphanEventTypes}`);
  console.log(`  - Orphan Bookings: ${orphanBookings}`);

  if (orphanEventTypes > 0 || orphanBookings > 0) {
    console.warn(`[RECOVERY_TEST] Notice: Found orphaned records in backup.`);
  } else {
    console.log(`[RECOVERY_TEST] Referential integrity check PASSED!`);
  }

  console.log(`[RECOVERY_TEST] Recovery verification test COMPLETED SUCCESSFULLY.`);
}

testRecovery();
