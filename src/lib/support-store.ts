import fs from "fs";
import path from "path";

export interface StoredSupportTicket {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  category: "BOOKING" | "BILLING" | "INTEGRATIONS" | "TEAMS" | "BUG" | "OTHER";
  priority: "LOW" | "NORMAL" | "URGENT";
  subject: string;
  message: string;
  userId?: string | null;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  deliveredToTeam: boolean;
  deliveryChannels: string[];
}

const memoryStore: StoredSupportTicket[] = [];

function getStoreFilePath(): string {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // Ignore if cannot create
    }
  }
  return path.join(dir, "support-tickets.json");
}

export function saveSupportTicketToDisk(ticket: StoredSupportTicket): boolean {
  try {
    memoryStore.unshift(ticket);
    if (memoryStore.length > 500) memoryStore.pop();

    const filePath = getStoreFilePath();
    let existing: StoredSupportTicket[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        existing = JSON.parse(raw);
      } catch {
        existing = [];
      }
    }
    existing.unshift(ticket);
    fs.writeFileSync(filePath, JSON.stringify(existing.slice(0, 500), null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to write support ticket to disk:", err);
    // Still in memoryStore
    return memoryStore.length > 0;
  }
}

export function getAllSupportTickets(): StoredSupportTicket[] {
  try {
    const filePath = getStoreFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read support tickets from disk:", err);
  }
  return memoryStore;
}
