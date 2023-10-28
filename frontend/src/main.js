import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App);

app.use(vue3GoogleLogin, {
    clientId: '734745641942-tjt6k3hbvtsla35servfkae58rb7cura.apps.googleusercontent.com'
});

app.use(router);
app.use(store);

app.mount('#app');
