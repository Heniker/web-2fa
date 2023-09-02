const persistCache = new WeakMap<any, any>()
const persistKey = {}

/**
 * Last argument is always value to be persisted
 * can be used as a convinence to avoid closures or to attach metadata to object
 * do not use it though, as it's rather easy to get wrong
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

/**
 * Somewhat typed version of persist
 * Optional argument allows providing default value that will be initiated on first call
 * When using optional argument, `undefined` will never be returned
 */
export const makePersist = <T extends readonly object[], R extends unknown>(
  makeDefaultVal?: () => R
) => {
  const localPersistKey = {}

  return <J extends R | void = void>(...args: [...T, J?]): J extends R ? void : R => {
    const result = persist(localPersistKey, ...args)

    if (result === undefined && makeDefaultVal) {
      const defaultVal = makeDefaultVal()
      persist(localPersistKey, ...args, defaultVal)
      return defaultVal as any
    }

    return result
  }
}
