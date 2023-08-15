const promisesMap = new Map<
  PromiseLike<any>,
  {
    status: 'resolved' | 'rejected' | ''
    result: any
    resolve: (value: any) => any
    reject: (value: any) => any
  }
>()

export const make = <T>() => {
  const promise = {
    then(onresolve, onreject) {
      const saved = promisesMap.get(this)
      assert(saved) // can actually never happen

      if (saved.status === 'resolved') {
        onresolve?.(saved.result)
        return this
      }

      if (saved.status === 'rejected') {
        onreject?.(saved.result)
        return this
      }

      promisesMap.set(
        this,
        Object.assign({}, saved, {
          resolve: (arg: any) => {
            saved.resolve(arg)
            onresolve?.(arg)
          },
          reject: (arg: any) => {
            saved.reject(arg)
            onreject?.(arg)
          },
        })
      )

      return this
    },
  } as PromiseLike<T>

  promisesMap.set(promise, {
    result: undefined,
    status: '',

    resolve(arg) {
      if (this.status) {
        return
      }
    },
    reject(arg) {
      if (this.status) {
        return
      }
    },
  })

  return promise
}

export const resolve = <T = void>(promise: PromiseLike<T>, resolveArg?: T) => {
  const storedPromise = promisesMap.get(promise)

  if (storedPromise && storedPromise.status === '') {
    storedPromise.status = 'resolved'
    storedPromise.result = resolveArg

    // promises are supposed to resolve on `queueMicrotask` 
    queueMicrotask(() => {
      storedPromise.resolve(resolveArg)
    })
  }
}

export const reject = <T = void>(promise: PromiseLike<T>, rejectArg: any = undefined) => {
  const storedPromise = promisesMap.get(promise)

  if (storedPromise && storedPromise.status === '') {
    storedPromise.status = 'rejected'
    storedPromise.result = rejectArg

    // promises are supposed to resolve on `queueMicrotask`
    queueMicrotask(() => {
      storedPromise.reject(rejectArg)
    })
  }
}

export const reset = <T = void>(promise: PromiseLike<T>) => {
  const storedPromise = promisesMap.get(promise)
  if (storedPromise) {
    storedPromise.status = ''
    storedPromise.result = undefined
  }
}
