import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './vuetify'
import vue3GoogleLogin from 'vue3-google-login'
import mitt from 'mitt'

const globalEmitter = mitt();

const app = createApp(App);

app.use(vue3GoogleLogin, {
    clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID
});

app.use(router);
app.use(store);
app.use(vuetify);

app.provide('globalEmitter', globalEmitter);

app.mount('#app');
