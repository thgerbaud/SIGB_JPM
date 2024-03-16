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

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';
import { login } from '@/services/AuthService';
import ErrorDialog from '@/components/utils/dialogs/ErrorDialog.vue';

defineProps(["library"]);

const router = useRouter();
const userStore = useUserStore();


const errorDialog = ref(false);

async function callback(response) {
    login(response.code)
        .then(data => {
            const token = data.accessToken;
            const user = data.userData;
            console.log(token); //! temp
            userStore.setToken(token);
            userStore.setUser(user);
            router.push('/home/libraries');
        })
        .catch(() => {
            errorDialog.value = true;
        });
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
