import * as v from 'vue'

const appToConstructs = new WeakMap<v.App, WeakSet<typeof ServiceA>>()

export abstract class ServiceA {
  constructor() {
    const app = v.getCurrentInstance()?.appContext.app
    assert(app)

    const constructs = appToConstructs.get(app) || new WeakSet()

    if (constructs.has(new.target)) {
      console.error('Creating more than one instance of Service is not allowed.\n')
      console.error(new.target)
      console.error(`- was created more than once`)

      throw new Error('Service is a singleton')
    }

    constructs.add(new.target)
    appToConstructs.set(app, constructs)
  }

  /**
   * Reactive data that this service provides
   */
  abstract reactive?: ReturnType<typeof v.reactive>
}
