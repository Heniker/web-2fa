import { KeyValStorageDataI } from './_types'
import { useDisplay } from 'vuetify'

type Falsy = false | 0 | '' | null | undefined
type AssertT = (condition: any, msg?: string) => asserts condition
type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>

declare module 'vue' {
  interface ComponentCustomProperties {
    console: Console
    display: ReturnType<typeof useDisplay>
  }

  interface ComponentCustomProps {
    'aria-autocomplete'?: string // vuetify ?bug
  }
}

declare global {
  module 'vue-router' {
    export declare type RouteRecordName = string | number | symbol
    export * from 'vue-router'

    // export declare interface LocationAsRelativeRaw {
    //   name?: RouteRecordName | number;
    //   params?: RouteParamsRaw;
    // }
    // type RouteRecordName = RouteRecordName | number;
  }

  interface NumberConstructor {
    (value: Boolean): 1 | 0
    (value: true): 1
    (value: false): 0
  }

  interface Array<T> {
    filter<S extends T>(predicate: BooleanConstructor, thisArg?: any): Exclude<S, Falsy>[]
  }

  interface ObjectConstructor {
    keys<T>(
      obj: T
    ): T extends object ? (keyof T)[] : T extends Array<any> | string ? string[] : never
  }

  type ToEntries<T> = {
    [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]]
  }[keyof T][]

  var assert: AssertT
  var __webpack_module__: typeof module
}

declare module '*.css' {
  const value: string
  export = value
}

export {}
