import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/style/icon.css'
import './assets/style/reset.css'
import './assets/style/border.css'
import './assets/style/global.styl'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
