/**
 * Code from
 * https://github.com/hectorm/otpauth/blob/master/src/utils/encoding/base32.js
 * @license https://github.com/hectorm/otpauth/blob/master/LICENSE.md
 *
 * Converts a base32 string to an ArrayBuffer (RFC 4648).
 * @see [LinusU/base32-decode](https://github.com/LinusU/base32-decode)
 * @param {string} str Base32 string.
 * @returns {ArrayBuffer} ArrayBuffer.
 */
function base32ToBuf(str: string) {
  /**
   * RFC 4648 base32 alphabet without pad.
   * @type {string}
   */
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

  // Canonicalize to all upper case and remove padding if it exists.
  let end = str.length
  while (str[end - 1] === '=') --end
  const cstr = (end < str.length ? str.substring(0, end) : str).toUpperCase()

  const buf = new ArrayBuffer(((cstr.length * 5) / 8) | 0)
  const arr = new Uint8Array(buf)

  let bits = 0
  let value = 0
  let index = 0
  for (let i = 0; i < cstr.length; i++) {
    const idx = ALPHABET.indexOf(cstr[i]!)
    if (idx === -1) throw new TypeError(`Invalid character found: ${cstr[i]}`)

    value = (value << 5) | idx
    bits += 5

    if (bits >= 8) {
      bits -= 8
      arr[index++] = value >>> bits
    }
  }

  return buf
}

async function formBinaryCode(
  base32Key: string,
  timeStep: number,
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'
) {
  const timeBuffer = new ArrayBuffer(8)
  new DataView(timeBuffer).setUint32(4, Math.floor(Date.now() / 1000 / timeStep), false)

  const hmacSha1 = await crypto.subtle.sign(
    'HMAC',
    await crypto.subtle.importKey(
      'raw',
      base32ToBuf(base32Key),
      {
        name: 'HMAC',
        hash: {
          name: algorithm,
        },
      },
      false,
      ['sign']
    ),
    timeBuffer
  )

  const hmac = new Uint8Array(hmacSha1)
  const offset = hmac[hmac.length - 1]! & 0xf
  return (
    ((hmac[offset + 0]! & 0x7f) << 24) |
    ((hmac[offset + 1]! & 0xff) << 16) |
    ((hmac[offset + 2]! & 0xff) << 8) |
    (hmac[offset + 3]! & 0xff)
  )
}

export async function formOtpCode(
  base32Key: string,
  timeStep: number,
  digits: number,
  algorithm: Parameters<typeof formBinaryCode>[2]
) {
  return ((await formBinaryCode(base32Key, timeStep, algorithm)) % Math.pow(10, digits))
    .toString()
    .padStart(digits, '0')
}

export async function formSteamCode(base32Key: string, timeStep = 30, digits = 5) {
  const STEAM_ALPHABET = '23456789BCDFGHJKMNPQRTVWXY'

  let code = await formBinaryCode(base32Key, timeStep, 'SHA-1')
  let result = ''

  for (let i = 0; i < digits; i++) {
    const c = STEAM_ALPHABET.charAt(code % STEAM_ALPHABET.length)
    code /= STEAM_ALPHABET.length
    result += c
  }

  return result
}
