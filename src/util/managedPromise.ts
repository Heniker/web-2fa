const resolveSymbol = Symbol('resolve')
const rejectSymbol = Symbol('reject')

class ManagedPromise<T> extends Promise<T> {
  static [Symbol.species] = Promise;

  [resolveSymbol]: (value: T) => void;
  [rejectSymbol]: (reason: any) => void

  constructor() {
    let localResolve = (_: T) => {}
    let localReject = () => {}

    super((resolve, reject) => {
      localResolve = resolve
      localReject = reject
    })

    this[resolveSymbol] = localResolve
    this[rejectSymbol] = localReject
  }
}

export const make = <T>() => {
  return new ManagedPromise()
}

export const resolve = <T>(promise: ManagedPromise<T>, resolveArg: T) => {
  promise[resolveSymbol](resolveArg)
}

export const reject = <T>(promise: ManagedPromise<T>, rejectArg: any) => {
  promise[rejectSymbol](rejectArg)
}
