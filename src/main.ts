import 'vuetify/lib/styles/main.css'
import { createApp } from 'vue'
import * as Router from 'vue-router'
import { createVuetify } from 'vuetify'
import PortalVue from 'portal-vue'
import { buildPages } from 'vue-pages-builder'
import * as services from './services'
import App from './App.vue'

assert(globalThis.crypto.subtle, 'crypto.subtle is not avaliable')

const app = createApp(App)
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'test',
    themes: {
      test: {
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

{
  const weakContext = require.context('./routes', true, /.*\.vue/, 'weak')
  var routes = buildPages(weakContext, require.context('./routes', true, /.*\.vue/, 'lazy'), {
    getName: (path) => String(weakContext.resolve(path)),
  })
}

const router = Router.createRouter({ routes, history: Router.createWebHistory() })

app.use(router)
app.use(vuetify)

// PortalVue is used because native teleport is super buggy
// https://github.com/vuejs/core/issues/5833
// https://github.com/vuejs/core/issues/5594
app.use(PortalVue)

// Create instances first THEN call .provide
// Because services should not have a chance to use injected instances synchronously
Object.values(services)
  .map((it) => [it, app.runWithContext(() => new it())] as const)
  .forEach(([construct, instance]) => {
    // Do not forget to add `static token` to all services (TS enforces this here)

    app.provide(construct.token, instance)
  })

app.config.globalProperties.window = window
app.config.globalProperties.console = console

app.mount('#app')

export { app }
