/**
 * TOTP (Time-based One-Time Password) Implementation
 * For 2FA authentication
 */

import { TOTP, Secret } from 'otpauth';

/**
 * Generate a new TOTP secret for a user
 */
export function generateTOTPSecret(userEmail: string): {
  secret: string;
  uri: string;
} {
  const totp = new TOTP({
    issuer: 'Secure Attendance',
    label: userEmail,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  });

  return {
    secret: totp.secret.base32,
    uri: totp.toString(),
  };
}

/**
 * Verify a TOTP code
 */
export function verifyTOTP(secret: string, token: string): boolean {
  try {
    const totp = new TOTP({
      secret: Secret.fromBase32(secret),
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    });

    // Allow 1 period before and after for clock skew
    const delta = totp.validate({ token, window: 1 });
    return delta !== null;
  } catch (error) {
    console.error('TOTP verification error:', error);
    return false;
  }
}

/**
 * Generate current TOTP code (for testing)
 */
export function generateTOTPCode(secret: string): string {
  const totp = new TOTP({
    secret: Secret.fromBase32(secret),
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  });

  return totp.generate();
}
