<template>
    <GoogleLogin :callback="callback">
        <button id="login-btn">
            <img id="google-logo" src="@/assets/google.svg" alt="Google logo">
            <legend id="btn-legend">Se connecter avec Google</legend>
        </button>
    </GoogleLogin>
</template>

<script>
import AuthService from "@/services/AuthService";
import { mapMutations } from "vuex";
export default {
    methods: {
        ...mapMutations(["setToken", "setUser"]),
        async callback(response) {
            console.log("Handle the response", response.code);
            AuthService.login(response.code)
                .then(data => {
                    const token = data.accessToken;
                    const user = data.userData;
                    this.setToken(token);
                    this.setUser(user);
                    this.$router.push(`/home/libraries`);
                })
                .catch(err => {
                    console.error(err);
                    alert("Something went wrong !");
                });
        }
    }
}
</script>

<style scoped>
#login-btn {
    background-color: var(--white);
    height: 4rem;
    padding: 0 4rem;
    border-radius: 2rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

#google-logo {
    height: 2rem;
}

#btn-legend {
    color: var(--label-color);
    font-size: var(--medium2);
    white-space: nowrap;
}
</style>
