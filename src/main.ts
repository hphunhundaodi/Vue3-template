import { createApp } from 'vue'

/**
 * 注意css的引入顺序会互相影响
 */

// 加载tailwind.css
import './tailwind.css'
// 加载element-plus
import 'element-plus/dist/index.css'
// 加载App及其中的css
import App from './App.vue'

// 实例化Vue App
const app = createApp(App)

// 安装Pinia
import { createPinia } from 'pinia'
app.use(createPinia())

// 安装Vue-router
import router from './router/index'
app.use(router)

// 全局安装element-plus
import ElementPlus from 'element-plus'
app.use(ElementPlus)

// 挂载Vue
app.mount('#app')
