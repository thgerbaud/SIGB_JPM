import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App);

app.use(vue3GoogleLogin, {
    clientId: '734745641942-lfvd74r29ic7ge20vjloivpp26vum2dm.apps.googleusercontent.com'
});

app.use(router);

app.mount('#app');
