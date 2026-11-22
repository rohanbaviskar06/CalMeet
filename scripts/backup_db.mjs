import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const prisma = new PrismaClient();

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.resolve(process.cwd(), "backups");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log(`[BACKUP] Starting CalMeet database backup at ${new Date().toISOString()}...`);

  try {
    const [
      users,
      accounts,
      eventTypes,
      bookings,
      availabilities,
      integrations,
      teams,
      teamMembers,
      teamInvitations,
      routingForms,
      workflows,
      webhooks,
      apiKeys,
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.account.findMany(),
      prisma.eventType.findMany(),
      prisma.booking.findMany(),
      prisma.availability.findMany(),
      prisma.integration.findMany(),
      prisma.team.findMany(),
      prisma.teamMember.findMany(),
      prisma.teamInvitation.findMany(),
      prisma.routingForm.findMany(),
      prisma.workflow.findMany(),
      prisma.webhook.findMany(),
      prisma.apiKey.findMany(),
    ]);

    const backupData = {
      version: "1.0",
      createdAt: new Date().toISOString(),
      counts: {
        users: users.length,
        accounts: accounts.length,
        eventTypes: eventTypes.length,
        bookings: bookings.length,
        availabilities: availabilities.length,
        integrations: integrations.length,
        teams: teams.length,
        teamMembers: teamMembers.length,
        teamInvitations: teamInvitations.length,
        routingForms: routingForms.length,
        workflows: workflows.length,
        webhooks: webhooks.length,
        apiKeys: apiKeys.length,
      },
      data: {
        users,
        accounts,
        eventTypes,
        bookings,
        availabilities,
        integrations,
        teams,
        teamMembers,
        teamInvitations,
        routingForms,
        workflows,
        webhooks,
        apiKeys,
      },
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const backupFilePath = path.join(backupDir, `calmeet_backup_${timestamp}.json`);
    fs.writeFileSync(backupFilePath, jsonString, "utf-8");

    // Compute SHA-256 integrity hash
    const hash = crypto.createHash("sha256").update(jsonString).digest("hex");
    const hashFilePath = path.join(backupDir, `calmeet_backup_${timestamp}.sha256`);
    fs.writeFileSync(hashFilePath, `${hash}  calmeet_backup_${timestamp}.json\n`, "utf-8");

    console.log(`[BACKUP] Backup completed successfully!`);
    console.log(`[BACKUP] Archive: ${backupFilePath} (${(Buffer.byteLength(jsonString) / 1024).toFixed(1)} KB)`);
    console.log(`[BACKUP] SHA-256: ${hash}`);
    console.log(`[BACKUP] Summary: ${JSON.stringify(backupData.counts)}`);
  } catch (error) {
    console.error("[BACKUP] Backup failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runBackup();
