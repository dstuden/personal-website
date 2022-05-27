import { createApp } from 'vue'
import App from './App.vue'
import ScrollAnimation from './directives/ScrollAnimation'

const app = createApp(App)

app.directive('scrollanimation', ScrollAnimation.bind)

app.mount('#app')
