import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://calmeet.app";
  const routes = [
    "",
    "/pricing",
    "/enterprise",
    "/developers",
    "/blog",
    "/security",
    "/privacy",
    "/terms",
    "/cookies",
    "/support",
    "/solutions/individuals",
    "/solutions/teams",
    "/solutions/sales",
    "/solutions/marketing",
    "/solutions/recruiting",
    "/solutions/support",
    "/solutions/education",
    "/solutions/healthcare",
    "/solutions/telehealth",
    "/solutions/hr",
    "/solutions/organizations",
    "/resources/app-store",
    "/resources/help-docs",
    "/resources/api-docs",
    "/resources/embed",
    "/resources/workflows",
    "/resources/collective-events",
    "/resources/dynamic-group-links",
    "/resources/instant-meetings",
    "/resources/out-of-office",
    "/resources/payments",
    "/resources/webhooks",
    "/resources/font",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "daily" : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/pricing") || route.startsWith("/solutions") ? 0.8 : 0.6,
  }));
}
