/**
 * Crockford base32 minus I, L, O and U — so a PNR read aloud over the phone
 * can't be misheard, and can't accidentally spell anything.
 */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function generatePnr(): string {
  const bytes = new Uint8Array(8);

  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }

  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]);
  return `SG-${chars.slice(0, 4).join('')}-${chars.slice(4).join('')}`;
}
