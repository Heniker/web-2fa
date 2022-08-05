import 'vuetify/lib/styles/main.css'
import sheet from './a.css'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as Router from 'vue-router'
import { buildPages } from 'vue-route-builder'
import App from './App.vue'

// @ts-ignore
document.adoptedStyleSheets = [sheet]

const app = createApp(App)
const vuetify = createVuetify()

const routes = buildPages(
  require.context('./routes', true, /.*\.vue/, 'weak'),
  require.context('./routes', true, /.*\.vue/, 'lazy' /* or any other except weak */)
)
const router = Router.createRouter({ routes, history: Router.createWebHistory() })

app.use(router)
app.use(vuetify)
// app.component('router-view', )

app.mount('#app')
