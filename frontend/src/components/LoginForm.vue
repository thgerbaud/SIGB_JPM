<template>
    <div>
        <input id="user-input" type="text" placeholder="Nom d'utilisateur">
        <button @click="login">Se connecter</button>
    </div>
</template>

<script>
import router from '@/router';

export default {
    name: "login-form",
    methods: {
        login(){
            const user = document.getElementById("user-input").value;
            router.push({path: `/${user}/libraries`});
            //TODO
        }
    }
}
</script>