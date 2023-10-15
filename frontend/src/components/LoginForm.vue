<template>
    <main class="center-content">
            <GoogleLogin :callback="callback" />
    </main>
</template>

<script>
import router from '@/router';
import { decodeCredential } from 'vue3-google-login'

export default {
    name: "login-form",
    methods: {
        login() {
            const user = document.getElementById("user-input").value;
            router.push({ path: `/${user}/libraries` });
            //TODO
        },
        callback(response) {
            const userData = decodeCredential(response.credential);
            console.log("Handle the userData", userData);
            //router.push({ path: `/tgerbaud/libraries` })
        }
    }
}
</script>

<style>
#temp-login-form {
    max-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>