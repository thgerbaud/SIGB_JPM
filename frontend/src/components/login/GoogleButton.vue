<template>
    <ErrorDialog v-model="errorDialog" @close="errorDialog = false"
        message="Une erreur s'est produite lors de l'authentification avec Google. Veuillez réessayer plus tard." />

    <GoogleLogin :callback="callback">
        <button id="login-btn" class="px-4 px-md-8 py-2 py-sm-4 rounded-pill d-flex align-center bg-white">
            <img id="google-logo" src="@/assets/google.svg" alt="Google logo" class="mr-2" />
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
            router.push('/');
        })
        .catch(() => {
            errorDialog.value = true;
        });
}
</script>

<style scoped>
#google-logo {
    height: 2rem;
}
</style>
