/** Supabase email OTP length (must match Auth email template). */
export const EMAIL_OTP_LENGTH = 8;

export function normalizeEmailOtpDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, EMAIL_OTP_LENGTH);
}

export function isValidEmailOtpLength(digits: string): boolean {
  return digits.length === EMAIL_OTP_LENGTH;
}
