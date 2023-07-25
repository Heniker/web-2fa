const persistCache = new Map()
const persistKey = Symbol()
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
      const wm = new Map()
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
