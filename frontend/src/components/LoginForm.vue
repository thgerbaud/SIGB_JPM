<template>
    <main class="center-content">
        <legend>Connectez-vous pour continuer</legend>
        <GoogleLogin :callback="callback">
            <button>Login</button>
        </GoogleLogin>
    </main>
</template>

<script>
import AuthService from "../services/AuthService";
import { mapMutations } from "vuex";

export default {
    name: "login-form",
    methods: {
        ...mapMutations(["setToken", "setUser"]),
        async callback(response) {
            console.log("Handle the response", response.code);
            AuthService.login(response.code)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            });
            /*
            const token = response.credential;
            const user = decodeCredential(token);
            this.setToken(token);
            this.setUser(user);

            this.$router.push(`/home/libraries`);*/
        }
    }
}
</script>

<style></style>