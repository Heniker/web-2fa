type AssertT = (condition: any, msg?: string) => asserts condition

declare const assert: AssertT

declare module '*.png' {
  const value: string
  export = value
}

declare module '*.svg' {
  const value: string
  export = value
}

declare module '*.vue' {
  import Vue from 'vue'

  export default Vue
}
