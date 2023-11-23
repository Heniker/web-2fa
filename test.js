import * as otp from 'otpauth'

const a = new ArrayBuffer(8)

const STEAM_ALPHABET = '23456789BCDFGHJKMNPQRTVWXY'

const digits = 5

const code = Number(
  otp.TOTP.generate({
    secret: otp.Secret.fromBase32('6CJLIEWALRJTFXPIUQB3INWGZIZOJNFQ'),
    digits,
    algorithm: 'SHA1',
    period: 30,
  })
)

console.log(code)

const result = []

let codeNum = code
for (let i = 0; i < digits; i++) {
  const c = STEAM_ALPHABET.charAt(codeNum % STEAM_ALPHABET.length)
  result.push(c)
  codeNum /= STEAM_ALPHABET.length
}

console.log(result)

//
//
//


var c = test(30,0,'OCN2EMNYLKZX574Q', 6)
console.log(c)

async function test(timeStep = 30, bias = 0, key, digits) {
  var _hex = ''
  {
    let bits = ''
    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

    for (var i = 0; i < key.length; i++) {
      var val = base32chars.indexOf(key.charAt(i).toUpperCase())
      bits += val.toString(2).padStart(5, '0')
    }
    for (i = 0; i + 4 <= bits.length; i += 4) {
      var chunk = bits.substr(i, 4)
      _hex += parseInt(chunk, 2).toString(16)
    }
  }

  var _keybytes
  {
    let _hexi = BigInt('0x' + _hex)
    let result = new Uint8Array(16)
    let i = 0
    while (_hexi > 0) {
      result[i++] = Number(_hexi % BigInt(256))
      _hexi = _hexi / BigInt(256)
    }
    _keybytes = result.reverse()
  }

  var _timeFactor
  {
    const _buf = new ArrayBuffer(8)
    const _view = new DataView(_buf)
    _view.setUint32(4, Math.floor((Date.now() / 1000 - bias) / timeStep), false)
    _timeFactor = _buf
  }

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    _keybytes,
    {
      name: 'HMAC',
      hash: {
        name: 'SHA-1',
      },
    },
    false,
    ['sign']
  )

  const signature = await window.crypto.subtle.sign('HMAC', key, _timeFactor)

  var code
  {
    const hmac = new Uint8Array(signature)
    const offset = hmac[hmac.length - 1] & 0xf
    const bin_code =
      ((hmac[offset + 0] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)
    code = (bin_code % Math.pow(10, digits)).toString().padStart(6, '0')
  }

  return code
}
