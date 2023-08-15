const persistCache = new WeakMap<any, any>()
const persistKey = {}

/**
 * Last argument is always value to be persisted
 * can be used as a convinence to avoid closures or for simple debugging
 * do not use it though, as it's extremly easy to get wrong
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
  return undefined
}

/**
 * Somewhat typed version of persist
 */
export const makePersist = <T extends readonly object[], R extends unknown>() => {
  const localPersistKey = {}
  return <J extends R | void = void>(...args: [...T, J?]): J extends R ? void : R => {
    return persist(localPersistKey, ...args)
  }
}

const whenInitCallFinishedP = makePersist<[any], PromiseLike<void>>()
const b = whenInitCallFinishedP({}, Promise.resolve())
const a = whenInitCallFinishedP({})
