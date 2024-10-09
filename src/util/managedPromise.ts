export class ManagedPromise<T = void> extends Promise<T> {
  static [Symbol.species] = Promise

  resolve: (value: T) => void
  reject: (reason: any) => void

  constructor() {
    let localResolve = (_: T) => {}
    let localReject = () => {}

    super((resolve, reject) => {
      localResolve = resolve
      localReject = reject
    })

    this.resolve = localResolve
    this.reject = localReject
  }
}
