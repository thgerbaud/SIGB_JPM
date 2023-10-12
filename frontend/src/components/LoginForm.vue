<template>
    <main>
        <section id="temp-login-form" class="submit-form">
            <input id="user-input" type="text" placeholder="Nom d'utilisateur">
            <button @click="login">Se connecter</button>
        </section>
    </main>
</template>

<script>
import router from '@/router';

export default {
    name: "login-form",
    methods: {
        login() {
            const user = document.getElementById("user-input").value;
            router.push({ path: `/${user}/libraries` });
            //TODO
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