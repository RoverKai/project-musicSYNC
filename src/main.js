import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import {router} from './router/router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { WebSocketPlugin } from './plugins/WebSocketPlugin'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(WebSocketPlugin)
.mount('#app')
