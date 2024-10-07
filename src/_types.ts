import type { Tagged } from 'type-fest'

export type TokenAlgorithmT = 'SHA-1' | 'SHA-256' | 'SHA-512' | 'STEAM'

export const TokenAlgorithms = [
  'STEAM',
  'SHA-1',
  'SHA-256',
  'SHA-512',
] as const satisfies readonly TokenAlgorithmT[]

export const isTokenAlgorithm = (arg: string): arg is TokenAlgorithmT => {
  return TokenAlgorithms.includes(arg as TokenAlgorithmT)
}

export interface TokenI {
  id: ReturnType<typeof import('nanoid')['nanoid']>
  label: string
  /** Seconds */
  period: number
  /** Normally SHA1 */
  algorithm: TokenAlgorithmT
  /** Normally 6 */
  digits: number
  /** Or description */
  issuer: string
}

export type TokenSecretTag = Tagged<string, 'tokenSecret'>

export type EncryptedTag<T = void> = Tagged<Uint8Array, 'encrypted', T>

export interface AppSettingsI {
  passwordKeepAlive: number
  theme: "dark" | "light"
  progressBarStyle: "grouped" | "multiple"
  preferLessAnimations: boolean
}

/* Everything except IV is encrpyted */
export interface KeyValStorage {
  /** Initialization vector used for encrypted content protection. Can be safely stored alongside encrypted content  */
  iv: Uint8Array
  'app-settings': AppSettingsI
  tokens: TokenI[]
  [key: `secret-${string}`]: string
  validation: 'valid'
}
