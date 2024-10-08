import type { MaybeComputedRef, Pausable, UseIntervalOptions } from '@vueuse/core'
import { EncryptedStorage } from './_types'
import { useDisplay, useTheme } from 'vuetify'
import type { Ref } from 'vue'

type AssertT = (condition: any, msg?: string) => asserts condition
type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>

declare module 'vue' {
  interface ComponentCustomProperties {
    console: Console
    window: Window
    display: ReturnType<typeof useDisplay>
    theme: ReturnType<typeof useTheme> & { name: { value: 'dark' | 'light' } }
  }

  interface ComponentCustomProps {
    'aria-autocomplete'?: string // vuetify ?bug
  }
}

// i did not create issue (stalebot will close it anyway)
declare module '@vueuse/core' {
  declare function useInterval(
    interval: MaybeComputedRef<number>,
    options: UseIntervalOptions<true>
  ): {
    counter: Ref<number>
  } & Pausable & { reset: () => void }
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

  type ToEntries<T> = {
    [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]]
  }[keyof T][]

  type Falsy = false | 0 | '' | null | undefined

  var assert: AssertT
  var __webpack_module__: typeof module
  var isEdge: boolean

  /** Webpack's publicPath value */
  var PUBLIC_PATH: string

  var _: any

  var __DEV__: boolean
}

declare module '*.css' {
  const value: string
  export = value
}

export {}
