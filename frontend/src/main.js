import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';
import vuetify from './vuetify';
import vue3GoogleLogin from 'vue3-google-login';
import mitt from 'mitt';

const globalEmitter = mitt();

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(vue3GoogleLogin, {
    clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID
});

app.use(vuetify);
app.use(router);
app.use(pinia);

app.provide('globalEmitter', globalEmitter);

app.mount('#app');
