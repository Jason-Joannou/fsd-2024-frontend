// main.js
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import locale from 'element-plus/es/locale/lang/en' // Update to the correct path
import router from './router';

const app = createApp(App);

app.use(ElementPlus, { locale });
app.use(router);

app.mount('#app');