import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "../src/lib/auth";

describe("Auth - password hashing", () => {
  it("should hash and verify password correctly", () => {
    const password = "test-password-123!";
    const hash = hashPassword(password);
    expect(hash).not.toBe(password);
    expect(comparePassword(password, hash)).toBe(true);
  });

  it("should reject wrong password", () => {
    const hash = hashPassword("correct-password");
    expect(comparePassword("wrong-password", hash)).toBe(false);
  });

  it("should produce different hashes for same password", () => {
    const password = "same-password";
    const hash1 = hashPassword(password);
    const hash2 = hashPassword(password);
    expect(hash1).not.toBe(hash2);
  });
});
