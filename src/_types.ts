export type TokenAlgorithmT = 'SHA1' | 'SHA256' | 'SHA512'

export const isTokenAlgorithm = (arg: string): arg is TokenAlgorithmT => {
  return ['SHA1', 'SHA256', 'SHA512'].includes(arg)
}

export interface TokenI {
  id: ReturnType<typeof import('nanoid')['nanoid']>
  label: string
  /** Seconds */
  period: number
  algorithm: TokenAlgorithmT
  /** Usually it is 6 */
  digits: number
  issuer: string
}

export interface AppSettingsI {
  /** ms. time to forget user password. +Infinity allowed */
  passwordKeepAlive: number
  theme: 'dark' | 'light'
  progressBarStyle: 'grouped' | 'multiple'
  preferLessAnimations: boolean
}

export interface KeyValStorageDataI extends Encrypted, Decrypted {
  /** Not encrypted */
  'app-settings'?: AppSettingsI

  /** Initialization vector used for encrypted content protection. Can be safely stored alongside encrypted content  */
  iv?: Uint8Array
}

interface Encrypted {
  /** Encrypted TokenI data. Can be decrpyted with user password and iv */
  'secure-tokens'?: Uint8Array

  /**
   * Token's secret is stored separetly. This is mostly a convenience so as to not keep secrets in RAM
   * (which is futille bcs no access to mem management, but w/e)
   * #security> This allows to know the amount of stored encrypted tokens
   * This is not a problem per se and no protection is implemented from this rn
   */
  [key: `secure-secret-${TokenI['id']}`]: Uint8Array

  /** Validation message used for testing provided password */
  'secure-validation'?: Uint8Array
}

interface Decrypted {
  tokens?: TokenI[]
  [key: `secret-${TokenI['id']}`]: string
  validation?: 'valid'
}
