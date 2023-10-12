<template>
    <nav>
        <menu>
            <router-link :to="`/${library._id}/books`" class="nav-link">{{ library.name }}</router-link>
            <router-link to="/" class="nav-link">Bibliothèques</router-link>
            <router-link to="/" class="nav-link">Déconnexion</router-link>
        </menu>
    </nav>
</template>

<script>

export default {
    name: "nav-bar",
    props: ["library"],
    data() {
        return {
        };
    },
    mounted() {
        console.log(this.library);
    }
}
</script>

<style>
nav {
    position: sticky;
    top: 0;
    background-color: var(--primary);
    padding: 1rem;
}

menu {
    margin: 0;
    padding: 0;
    display: flex;
    gap: 1rem;
}

.nav-link {
    color: white;
    text-decoration: none;
    font-size: var(--medium2);
}
</style>