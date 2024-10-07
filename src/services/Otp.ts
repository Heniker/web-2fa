import { TokenAlgorithms, type EncryptedTag, type TokenI, type TokenSecretTag } from '@/_types'
import { nanoid } from 'nanoid'
import { formOtpCode, formSteamCode } from '@local/otp-generator'
import type { SetOptional } from 'type-fest'
import { storageService } from '@/services/storage'
import type { StoreT } from '@/store'

const getCode = (token: TokenI, secret: string) =>
  token.algorithm === 'STEAM'
    ? formSteamCode(secret)
    : formOtpCode(secret, token.period, token.digits, token.algorithm)

const SUPPORTED_ALGORITHMS = TokenAlgorithms

{
  const timers: Record<TokenI['period'], () => void> = {}
  var eachPeriod = (period: number, action: () => void) => {
    let prev = timers[period]

    if (!prev) {
      prev = () => setTimeout(() => timers[period]!(), getRemainingTime(period))
      prev()
    }

    let isCancelled = false
    timers[period] = () => {
      prev!()
      isCancelled || action() // GC can probably figure this out
    }

    return () => (isCancelled = true)
  }
}

export const otpService = {
  SUPPORTED_ALGORITHMS,
  formToken,
  eachPeriod,
  validate,
  getRemainingTime,
  getTokens,
  saveTokens,
  saveSecret,
  generateCodeFor,
}

function formToken(arg: SetOptional<TokenI, 'id'>) {
  return {
    id: arg.id || nanoid(),
    label: arg.label,
    period: arg.period,
    algorithm: arg.algorithm,
    digits: arg.digits,
    issuer: arg.issuer,
  } as TokenI
}

async function validate(token: TokenI, secret: string) {
  try {
    await getCode(token, secret)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

function getRemainingTime(period: number) {
  return period * 1000 - (Date.now() % (period * 1000))
}

async function getTokens() {
  const encryptedTokens = await storageService.getItem('tokens')
  if (!encryptedTokens) {
    console.log('No secure-tokens found in storage')
    return undefined
  }

  assert(encryptedTokens.length, 'Tokens should not be empty. This is a bug')

  return encryptedTokens
}

async function saveSecret(token: TokenI, secret: EncryptedTag<TokenSecretTag>) {
  await storageService.setItem(`secret-${token.id}`, secret)
}

async function saveTokens(tokens: TokenI[], encrypt: StoreT['security']['encrypt']) {
  storageService.setItem('tokens', await encrypt(tokens.map(formToken)))
}

async function generateCodeFor(token: TokenI, decrypt: StoreT['security']['decrypt']) {
  const encryptedSecret = await storageService.getItem(`secret-${token.id}`)
  assert(encryptedSecret, `Secret not found for token <${token.id}>`)

  const secret = await decrypt(encryptedSecret)
  return getCode(token, secret)
}
