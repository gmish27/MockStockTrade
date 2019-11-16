import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Navbar, Input, Button, Field, Notification } from "buefy";
import 'buefy/dist/buefy.min.css'

Vue.use(Navbar)
Vue.use(Field)
Vue.use(Input)
Vue.use(Button)
Vue.use(Notification)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
