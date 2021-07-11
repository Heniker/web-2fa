import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import App from './App.vue'
import { vuetify } from './plugins/vuetify'
import { i18n } from './plugins/I18n'

Vue.use(VueCompositionApi)

new Vue({
  render: (h) => h(App),
  vuetify,
  i18n,
}).$mount('#app')
