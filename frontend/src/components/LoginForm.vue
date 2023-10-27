<template>
    <main>
        <div id="app-info">
            <img id="app-logo" alt="logo">
            <legend id="app-name">{Nom de l'application}</legend>
        </div>
        <legend id="main-legend">Connectez-vous pour continuer</legend>
        <GoogleLogin :callback="callback">
            <button id="login-btn">
                <img id="google-logo" src="../assets/google.svg" alt="Google logo">
                <legend id="btn-legend">Se connecter avec Google</legend>
            </button>
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
                    const token = res.data.accessToken;
                    const user = res.data.userData;
                    this.setToken(token);
                    this.setUser(user);
                    this.$router.push(`/home/libraries`);
                })
                .catch(err => {
                    console.log(err);
                    alert("Something went wrong !");
                });
        }
    }
}
</script>

<style scoped>
main {
    display: flex;
    align-items: center;
    padding-top: 6rem;
}

#app-info {
    display: flex;
    margin-bottom: 4rem;
    gap: 1rem;
    align-items: center;
}

#app-logo {
    /* temp */
    color: white;
    height: 4rem;
    width: 4rem;
}

#app-name {
    font-size: var(--large1);
    color: var(--white);
}

#main-legend {
    color: var(--white);
    font-size: var(--medium3);
    font-family: system-ui;
    font-weight: 300;
    margin-bottom: 2rem;
}

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