// @ts-nocheck
import * as services from './index'
import * as v from 'vue'
import { Security } from './Security'
import { appToken } from './util'
import { maybeTimeout } from '@/util/test-util'

const getSecurity = (storageKey = Math.random()) => {
  const app = v.createApp()
  app.provide(appToken, app)

  const instances = new Map(
    Object.values(services).map((it) => [it, app.runWithContext(() => new it())] as const)
  )

  ;[...instances.entries()].forEach(([key, val]) => {
    app.provide(key.token, val)
  })

  app.runWithContext(() => {
    const persistantStorage = v.inject(services.PersistentStorage.token)
    // practically new test every time!
    persistantStorage.init('|test|' + storageKey + '|')

    Object.values(services).forEach((it) => {
      const service = v.inject(it.token)

      assert(service)
      service.init?.()
    })
  })

  return instances.get(Security) as Security
}

// basic encryption & decryption
;(async () => {
  const securityService = getSecurity()
  await securityService.setupSecureContext('1234')

  const encrypted = await securityService.encrypt('test')
  const decrypted = await securityService.decrypt(encrypted)

  assert(decrypted === 'test')
})().then(maybeTimeout())

// is actually encrypting
;(async () => {
  const securityService = getSecurity()

  await securityService.setupSecureContext('1234')
  const encrypted = await securityService.encrypt('test')

  const fakeDecoded = new TextDecoder().decode(encrypted)
  assert(fakeDecoded !== 'test')
})().then(maybeTimeout())

// wrong password failure
;(async () => {
  const securityService1 = getSecurity()
  await securityService1.setupSecureContext('1234')
  const encrypted = await securityService1.encrypt('test')

  const securityService2 = getSecurity()
  await securityService2.setupSecureContext('wrong password')
  let error
  const decrypted = await securityService2.decrypt('test').then(
    () => {
      assert(false)
    },
    (err) => (error = err)
  )

  assert(error !== 'test')
  assert(error instanceof Error)
  assert(decrypted !== 'test')
})().then(maybeTimeout())

// double setup same result (simulate page reload)
;(async () => {
  const storageKey = Math.random()

  const securityService1 = getSecurity(storageKey)
  await securityService1.setupSecureContext('4321')
  const encrypted = await securityService1.encrypt('test')

  const securityService2 = getSecurity(storageKey)
  await securityService2.setupSecureContext('4321')
  const decrypted = await securityService2.decrypt(encrypted)

  assert(decrypted === 'test')
})().then(maybeTimeout())

// double setup wrong result
;(async () => {
  const securityService1 = getSecurity()
  await securityService1.setupSecureContext('4321')
  const encrypted = await securityService1.encrypt('test')

  const securityService2 = getSecurity()
  await securityService2.setupSecureContext('4321')

  let error
  const decrypted = await securityService2.decrypt(encrypted).then(
    () => {
      assert(false)
    },
    (err) => {
      error = err
    }
  )

  assert(error !== 'test')
  assert(error instanceof Error)
  assert(decrypted !== 'test')
})().then(maybeTimeout())
