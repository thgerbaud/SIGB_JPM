<template>
    <ErrorDialog v-model="errorDialog" @close="errorDialog = false"
        message="Une erreur s'est produite lors de l'authentification avec Google. Veuillez réessayer plus tard." />

    <GoogleLogin :callback="callback">
        <button id="login-btn">
            <img id="google-logo" src="@/assets/google.svg" alt="Google logo">
            <legend id="btn-legend">Se connecter avec Google</legend>
        </button>
    </GoogleLogin>
</template>

<script>
import { login } from '@/services/AuthService';
import ErrorDialog from '@/components/utils/dialogs/ErrorDialog.vue';
export default {
    data() {
        return {
            errorDialog: false,
        }
    },
    methods: {
        async callback(response) {
            login(response.code)
                .then(data => {
                    const token = data.accessToken;
                    const user = data.userData;
                    console.log(token); //! temp
                    this.$store.commit('setToken', token);
                    this.$store.commit('setUser', user);
                    this.$router.push(`/home/libraries`);
                })
                .catch(() => {
                    this.errorDialog = true;
                });
        }
    },
    components: { ErrorDialog }
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
