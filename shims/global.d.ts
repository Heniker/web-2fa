type AssertT = typeof import('assert')

type ProcessT = {
  env: { DEBUG: boolean; NODE_ENV: 'development' | 'production' }
}

interface Global {
  assert: AssertT
  process: ProcessT
}

// declare const assert: assertT
// declare const process: processT
