;(() => {
  var assert
  // only if assert not defined by webpack
  // which happens to be during prod build
  assert ??
    (window.assert = (c) => {
      if (!c) {
        throw new Error()
      }
    })
})()

// @ts-ignore
window.isEdge = navigator.userAgentData?.brands.some((it) => it.brand === 'Microsoft Edge')
if (isEdge) {
  console.log(`Edge browser`)
}

{
  // My way to run tests
  const tests = require.context('.', true, /\.test\.ts/) // tests are ignored during prod build
  tests.keys().forEach(tests)
  // is obviously the best way
}

assert(globalThis, 'globalThis is not avaliable')
assert(globalThis.indexedDB, 'indexedDB is not avaliable')
assert(globalThis.crypto.subtle, 'crypto.subtle is not avaliable')

import 'vuetify/styles/main.css'
import * as v from 'vue'
import * as Router from 'vue-router'
import { createVuetify, useDisplay, useTheme } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { buildPages } from 'vue-pages-builder'
import * as services from './services'
import App from './App.vue'
import { appToken } from './services/util'

const app = v.createApp(App)
{
  const vuetify = createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            background: '#2b2b2b',
            // background: '#1e1e1e',
            // surface: '#FFFFFF',
            // primary: '#6200EE',
            // secondary: '#03DAC6',
            // error: '#B00020',
            // info: '#2196F3',
            // success: '#4CAF50',
            // warning: '#FB8C00',
          },
        },
      },
    },
  })

  app.use(vuetify)
}

{
  const weakContext = require.context('./routes', true, /.*\.vue$/, 'weak')
  const routes = buildPages(weakContext, require.context('./routes', true, /.*\.vue/, 'lazy'), {
    getName: (path) => String(weakContext.resolve(path)),
  })

  const router = Router.createRouter({ routes, history: Router.createWebHistory(publicPath) })
  app.use(router)
}

app.provide(appToken, app)

// Create instances first THEN call .provide
// Because services should not have a chance to use injected instances synchronously
Object.values(services)
  .map((it) => [it, app.runWithContext(() => new it())] as const)
  .forEach(([construct, instance]) => {
    // Do not forget to add `static token` to all services (TS enforces this here)
    app.provide(construct.token, instance)
  })

console.log('<Services constructed>')

app.config.globalProperties.console = console
app.config.globalProperties.window = window

app.runWithContext(() => {
  // `useDisplay()` is wrapped in `reactive` because
  // `useDisplay()[someKey]` won't be reactive in template for some reason - you have to add `.value`
  // Probably vuetify bug, but I found no issues on github
  app.config.globalProperties.display = v.reactive(useDisplay()) as any
  Object.defineProperty(app.config.globalProperties, 'theme', {
    get: useTheme,
  })
})

app.mount('#app')
