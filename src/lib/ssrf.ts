import dns from "dns";

/**
 * Validates whether an IP address belongs to private, loopback, link-local, or cloud metadata ranges.
 */
export function isPrivateIp(ip: string): boolean {
  if (ip === "127.0.0.1" || ip === "0.0.0.0" || ip === "::1") return true;

  const parts = ip.split(".").map(Number);
  if (parts.length === 4 && parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    // 0.0.0.0/8 (Broadcast/Current network)
    if (parts[0] === 0) return true;
    // 10.0.0.0/8 (Private network)
    if (parts[0] === 10) return true;
    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;
    // 172.16.0.0/12 (Private network)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16 (Private network)
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 169.254.0.0/16 (Link Local / Cloud Metadata e.g. AWS 169.254.169.254)
    if (parts[0] === 169 && parts[1] === 254) return true;
  }

  const lowerIp = ip.toLowerCase();
  if (
    lowerIp === "::1" ||
    lowerIp.startsWith("fe80:") ||
    lowerIp.startsWith("fc00:") ||
    lowerIp.startsWith("fd00:")
  ) {
    return true;
  }

  return false;
}

/**
 * Validates that a webhook URL does not target localhost, private subnets, or internal cloud metadata.
 */
export async function isSafeWebhookUrl(urlStr: string): Promise<{ safe: boolean; reason?: string }> {
  try {
    const parsed = new URL(urlStr);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { safe: false, reason: "Webhook URL must start with http:// or https://" };
    }

    const hostname = parsed.hostname.toLowerCase();

    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    ) {
      return { safe: false, reason: "Targeting localhost or internal network hosts is not permitted." };
    }

    if (isPrivateIp(hostname)) {
      return { safe: false, reason: "Targeting private or link-local IP addresses is not permitted." };
    }

    try {
      const addresses = await dns.promises.lookup(hostname, { all: true });
      for (const addr of addresses) {
        if (isPrivateIp(addr.address)) {
          return { safe: false, reason: `Hostname resolves to private IP (${addr.address})` };
        }
      }
    } catch (dnsErr: any) {
      return { safe: false, reason: `Failed to resolve hostname: ${dnsErr?.message || "DNS error"}` };
    }

    return { safe: true };
  } catch {
    return { safe: false, reason: "Invalid URL format." };
  }
}
