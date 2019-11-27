import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { 
  Navbar, 
  Input, 
  Button, 
  Field, 
  Notification, 
  Tabs,
  Checkbox,
  Modal,
  Loading
} from "buefy";
import 'buefy/dist/buefy.min.css'
import VueAxiosPlugin from './http'

Vue.use(Navbar)
Vue.use(Field)
Vue.use(Input)
Vue.use(Button)
Vue.use(Notification)
Vue.use(Tabs)
Vue.use(Checkbox)
Vue.use(Modal)
Vue.use(Loading)
Vue.use(VueAxiosPlugin, {
  baseURL: 'https://playstock-6f244.firebaseio.com/',
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
