import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// ！！！关键：这里必须引入全局样式，否则页面没有手机框效果！！！
import './assets/main.css' 

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')