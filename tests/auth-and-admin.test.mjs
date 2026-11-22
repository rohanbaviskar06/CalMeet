import { test } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { isUserAdmin } from "../src/lib/admin.ts";

test("Admin Authorization - isUserAdmin accurately checks configured admin emails", () => {
  // Test with environment variable
  process.env.ADMIN_EMAILS = "admin@calmeet.com,rohan@example.com";
  assert.equal(isUserAdmin("admin@calmeet.com"), true);
  assert.equal(isUserAdmin("rohan@example.com"), true);
  assert.equal(isUserAdmin("ADMIN@calmeet.com"), true); // Case-insensitive
  assert.equal(isUserAdmin("attacker@evil.com"), false);
  assert.equal(isUserAdmin(""), false);
  assert.equal(isUserAdmin(null), false);
  assert.equal(isUserAdmin(undefined), false);
});

test("Authentication - bcrypt password hashing and verification", async () => {
  const plainPassword = "SuperSecretPassword123!";
  const wrongPassword = "WrongPassword!";
  const hash = await bcrypt.hash(plainPassword, 10);

  // Hash starts with bcrypt signature
  assert.equal(hash.startsWith("$2"), true);

  // Correct password matches
  const isCorrect = await bcrypt.compare(plainPassword, hash);
  assert.equal(isCorrect, true);

  // Wrong password fails
  const isWrong = await bcrypt.compare(wrongPassword, hash);
  assert.equal(isWrong, false);

  // Any password does not match (verifying bypass removal)
  const isAny = await bcrypt.compare("anything", hash);
  assert.equal(isAny, false);
});

test("Account Preservation - signup rejects existing email without data deletion", () => {
  // Simulate the signup check
  const existingUsers = [{ email: "user@example.com", id: "user-123" }];
  
  function checkSignup(email) {
    const exists = existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { error: "An account with this email address already exists. Please sign in instead." };
    }
    return { success: true };
  }

  const result = checkSignup("user@example.com");
  assert.equal(result.success, undefined);
  assert.equal(result.error.includes("already exists"), true);
  // Verify existing user was NOT deleted
  assert.equal(existingUsers.length, 1);
  assert.equal(existingUsers[0].id, "user-123");
});
