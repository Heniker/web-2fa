export type TokenAlgorithmT = 'SHA256'

export interface TokenI {
  id: string
  label: string
  period: number
  algorithm: TokenAlgorithmT
  codeLen?: number
}

/**
 * Defines data stored in `localStorage` after calling `JSON.parse`
 *
 * Values must be JSON-stringifyable (or parsable in PersistantStorage service)
 */
export interface LocalStorageDataI {
  /** Encrypted TokenI data. Can be decrpyted with user password */
  'secure-tokens'?: string
  'secure-iv'?: Uint8Array
}
