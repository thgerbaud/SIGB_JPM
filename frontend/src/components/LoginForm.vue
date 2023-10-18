<template>
    <main class="center-content">
            <GoogleLogin :callback="callback" />
    </main>
</template>

<script>
import { decodeCredential } from 'vue3-google-login';
import { mapMutations } from "vuex";

export default {
    name: "login-form",
    methods: {
        ...mapMutations(["setToken", "setUser"]),
        callback(response) {
            const token = response.credential;
            const user = decodeCredential(token);
            this.setToken(token);
            this.setUser(user);
            
            this.$router.push(`/home/libraries`)
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