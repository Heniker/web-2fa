import { isDefined } from '@/util'

const persistCache = new WeakMap<any, any>()
const persistKey = {}

/**
 * Last argument is always value to be persisted
 * can be used as a convinence to avoid closures or to attach metadata to object
 * do not use it though
 */
export const persist = (...args: [...any[]]) => {
  const lastArg = args.at(-1)

  let currentMap = persistCache
  for (let i = 0; i < args.length - 1; i++) {
    const stored = currentMap.get(args[i])

    if (stored) {
      currentMap = stored
    } else {
      const wm = new WeakMap()

      currentMap.set(args[i], wm)
      currentMap = wm
    }
  }

  const item = currentMap.get(lastArg)?.get(persistKey) /* ?? currentMap.get(persistKey) */

  if (item !== undefined) {
    return item
  }

  currentMap.set(persistKey, lastArg)
}

const persist2 = (path: any[], setValue?: any) => {
  let currentMap = persistCache

  for (let it of path) {
    const stored = currentMap.get(it)

    if (stored) {
      currentMap = stored
      continue
    }

    const wm = new WeakMap()

    currentMap.set(it, wm)
    currentMap = wm
  }

  isDefined(setValue) && currentMap.set(persistKey, setValue)
  return currentMap.get(persistKey)
}

export const makePersist = <T extends readonly object[], R>() => {
  const localKey = {}

  return (args: T, init?: () => R): R => {
    const result = persist2([localKey, ...args])
    return isDefined(result) ? result : persist2([localKey, ...args], init?.())
  }
}
