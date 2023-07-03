export type TokenAlgorithmT = 'SHA1' | 'SHA256' | 'SHA512'

export interface TokenI {
  id: string
  label: string
  /** Seconds */
  period: number
  algorithm: TokenAlgorithmT
  /** Usually it is 6 */
  codeLen: number
  description: string
}

/**
 */
export interface KeyValStorageDataI {
  /** Encrypted TokenI data. Can be decrpyted with user password and secure-iv */
  'secure-tokens'?: Uint8Array
  /** 
   * Token's secret is stored separetly. This is mostly a convenience so as to not keep secrets in RAM
   * (which is futille bcs no access to mem management, but w/e)
   * #security> This allows to know the amount of stored encrypted tokens
   * This is not a problem per se and no protection is implemented from this rn
   */
  [key: `secret-${TokenI['id']}`]: Uint8Array
  /** initialization vector used for encrypted content protection. Can be safely stored alongside encrypted content  */
  'secure-iv'?: Uint8Array
}
