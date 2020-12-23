interface RequireI extends __WebpackModuleApi.RequireFunction {
  resolve(id: string): string
}

type AssertT = (condition: any, msg?: string) => asserts condition

declare const assert: AssertT
declare const require: RequireI

// https://stackoverflow.com/questions/48011353/how-to-unwrap-type-of-a-promise?rq=1
declare type Await<T> = T extends PromiseLike<infer U> ? U : T

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
