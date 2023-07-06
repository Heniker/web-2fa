// @ts-nocheck
import * as services from './index'
import * as v from 'vue'
import { Security } from './Security'
import { appToken } from './util'

const maybeTimeout = (message = 'Test timeout', time = 1000) => {
  const timeout = setTimeout(() => {
    throw new Error(message)
  }, time)

  return () => {
    clearTimeout(timeout)
  }
}

const getSecurity = () => {
  const app = v.createApp()
  app.provide(appToken, app)

  const instances = new Map(
    Object.values(services).map((it) => [it, app.runWithContext(() => new it())] as const)
  )

  ;[...instances.entries()].forEach(([key, val]) => {
    app.provide(key.token, val)
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
