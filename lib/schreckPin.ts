/** PIN numérico de acceso SchreckNet (registro local). */

export const SCHRECKNET_PIN_DIGITS = 6 as const;

export function normalizeSchreckPin(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, SCHRECKNET_PIN_DIGITS);
}

export function isValidSchreckPin(pin: string): boolean {
  return new RegExp(`^\\d{${SCHRECKNET_PIN_DIGITS}}$`).test(pin.trim());
}
