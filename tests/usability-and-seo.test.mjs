import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Usability, SEO, and Navigation Standards", () => {
  it("Onboarding Wizard includes all 4 guided steps", () => {
    const wizardContent = fs.readFileSync(
      path.join(process.cwd(), "src/components/dashboard/onboarding-wizard.tsx"),
      "utf8"
    );

    assert.ok(wizardContent.includes("Create an event type"), "Missing step: Create an event type");
    assert.ok(wizardContent.includes("Set your availability"), "Missing step: Set your availability");
    assert.ok(wizardContent.includes("Connect your calendar"), "Missing step: Connect your calendar");
    assert.ok(wizardContent.includes("Share your booking link"), "Missing step: Share your booking link");
    assert.ok(wizardContent.includes("hasConnectedCalendar"), "Wizard should accept calendar connection state");
    assert.ok(wizardContent.includes("handleCopyShareLink"), "Wizard should support 1-click link copying");
  });

  it("Booking Form includes timezone indicator, details review, and signed management link", () => {
    const bookingFormContent = fs.readFileSync(
      path.join(process.cwd(), "src/components/booking/booking-form.tsx"),
      "utf8"
    );

    assert.ok(bookingFormContent.includes("manageUrl"), "Booking form should store manageUrl with guest token");
    assert.ok(bookingFormContent.includes("Meeting Review Summary Card") || bookingFormContent.includes("Guest Timezone:"), "Booking form should show meeting review summary card");
    assert.ok(bookingFormContent.includes("selectedTimezone"), "Booking form must prominently display selected timezone");
    assert.ok(bookingFormContent.includes("Reschedule or Cancel"), "Booking form confirmation must link to rescheduling/cancellation");
  });

  it("App Store and Integrations label status strictly as Available, Beta, or Coming soon", () => {
    const appStoreContent = fs.readFileSync(
      path.join(process.cwd(), "src/app/resources/app-store/page.tsx"),
      "utf8"
    );
    const integrationsContent = fs.readFileSync(
      path.join(process.cwd(), "src/app/dashboard/integrations/page.tsx"),
      "utf8"
    );

    assert.ok(appStoreContent.includes('"Available"'), "App store should have Available status");
    assert.ok(appStoreContent.includes('"Beta"'), "App store should have Beta status");
    assert.ok(appStoreContent.includes('"Coming soon"'), "App store should have Coming soon status");
    assert.ok(!appStoreContent.includes('"Coming Soon"'), "App store should not use inconsistent 'Coming Soon'");

    assert.ok(integrationsContent.includes("Coming soon"), "Dashboard integrations should display 'Coming soon'");
    assert.ok(integrationsContent.includes("Available"), "Dashboard integrations should display 'Available'");
    assert.ok(integrationsContent.includes("Beta"), "Dashboard integrations should display 'Beta'");
  });

  it("Canonical domain is strictly calmeet.app across embed codes, links, and examples", () => {
    const embedPageContent = fs.readFileSync(
      path.join(process.cwd(), "src/app/resources/embed/page.tsx"),
      "utf8"
    );
    const dynamicLinksContent = fs.readFileSync(
      path.join(process.cwd(), "src/app/resources/dynamic-group-links/page.tsx"),
      "utf8"
    );
    const termsContent = fs.readFileSync(
      path.join(process.cwd(), "src/app/terms/page.tsx"),
      "utf8"
    );
    const pricingModalContent = fs.readFileSync(
      path.join(process.cwd(), "src/components/dashboard/pricing-modal.tsx"),
      "utf8"
    );

    assert.ok(!embedPageContent.includes("calmeet.com"), "embed/page.tsx should not reference calmeet.com");
    assert.ok(!dynamicLinksContent.includes("calmeet.com"), "dynamic-group-links should not reference calmeet.com");
    assert.ok(!termsContent.includes("calmeet.com"), "terms should not reference calmeet.com");
    assert.ok(!pricingModalContent.includes("calmeet.com"), "pricing-modal should not reference calmeet.com");

    assert.ok(embedPageContent.includes("https://calmeet.app"), "embed/page.tsx should use https://calmeet.app");
    assert.ok(dynamicLinksContent.includes("calmeet.app"), "dynamic-group-links should use calmeet.app");
  });

  it("Sitemap includes all public routes", () => {
    const sitemapContent = fs.readFileSync(
      path.join(process.cwd(), "src/app/sitemap.ts"),
      "utf8"
    );

    const requiredRoutes = [
      '""',
      '"/pricing"',
      '"/enterprise"',
      '"/developers"',
      '"/support"',
      '"/help"',
      '"/solutions"',
      '"/resources"',
      '"/login"',
      '"/signup"',
      '"/terms"',
      '"/privacy"',
      '"/security"',
      '"/resources/app-store"',
      '"/resources/api-docs"',
      '"/resources/embed"',
    ];

    for (const r of requiredRoutes) {
      assert.ok(sitemapContent.includes(r), `Sitemap must include ${r}`);
    }
  });

  it("Public pages have dedicated server-side metadata layouts", () => {
    const layouts = [
      "src/app/pricing/layout.tsx",
      "src/app/enterprise/layout.tsx",
      "src/app/developers/layout.tsx",
      "src/app/support/layout.tsx",
      "src/app/help/layout.tsx",
      "src/app/security/layout.tsx",
      "src/app/privacy/layout.tsx",
      "src/app/terms/layout.tsx",
      "src/app/cookies/layout.tsx",
      "src/app/solutions/layout.tsx",
      "src/app/resources/layout.tsx",
      "src/app/booking/[id]/manage/layout.tsx",
    ];

    for (const l of layouts) {
      assert.ok(fs.existsSync(path.join(process.cwd(), l)), `Layout file missing: ${l}`);
      const content = fs.readFileSync(path.join(process.cwd(), l), "utf8");
      assert.ok(content.includes("export const metadata"), `${l} must export metadata`);
    }
  });
});
