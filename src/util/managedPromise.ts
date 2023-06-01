const promisesMap = new Map<
  PromiseLike<any>,
  { resolve: (value: any) => any; reject: (value: any) => any; reset: () => void }
>()

export const make = <T>() => {
  let resultValue: any // resolved or rejected value
  let status: 'resolved' | 'rejected' | undefined = undefined

  const promise = {
    then(onresolve, onreject) {
      if (status === 'resolved') {
        onresolve?.(resultValue)
        return this
      }

      if (status === 'rejected') {
        onreject?.(resultValue)
        return this
      }

      const saved =
        promisesMap.get(this) ||
        (promisesMap.set(this, {
          resolve: (arg) => {
            if (status) {
              return
            }

            resultValue = arg
            status = 'resolved'
          },
          reject: (arg) => {
            if (status) {
              return
            }

            resultValue = arg
            status = 'rejected'
          },
          reset: () => {
            resultValue = undefined
            status = undefined
            promisesMap.delete(this)
          },
        }),
        promisesMap.get(this))

      assert(saved) // can never happen, but makes TS happy

      promisesMap.set(this, {
        resolve: (arg) => {
          saved.resolve(arg)
          onresolve?.(arg)
        },
        reject: (arg) => {
          saved.reject(arg)
          onreject?.(arg)
        },
        reset: saved.reset,
      })

      return this
    },
  } as PromiseLike<T>

  return promise
}

export const resolve = <T = void>(promise: Promise<T>, resolveArg?: T) => {
  const storedPromise = promisesMap.get(promise)
  assert(storedPromise)
  storedPromise.resolve(resolveArg)
}

export const reject = <T = void>(promise: Promise<T>, rejectArg: any = undefined) => {
  const storedPromise = promisesMap.get(promise)
  assert(storedPromise)
  storedPromise.reject(rejectArg)
}

export const reset = <T = void>(promise: Promise<T>) => {
  const storedPromise = promisesMap.get(promise)
  assert(storedPromise)
  storedPromise.reset()
}
