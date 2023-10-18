<template>
    <main class="center-content">
            <GoogleLogin :callback="callback" />
    </main>
</template>

<script>
import router from '@/router';
import { decodeCredential } from 'vue3-google-login';
import { mapMutations } from "vuex";

export default {
    name: "login-form",
    methods: {
        ...mapMutations(["setToken", "setUser"]),
        login() {
            const user = document.getElementById("user-input").value;
            router.push({ path: `/${user}/libraries` });
            //TODO
        },
        callback(response) {
            const token = response.credential;
            const user = decodeCredential(token);
            this.setToken(token);
            this.setUser(user);

            //const userData = decodeCredential(response.credential);
            //console.log("Handle the userData", userData);
            
            this.$router.push(`/tgerbaud/libraries`)
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