<template>
    <nav>
        <menu>
            <router-link :to="`/${library}/books`" class="nav-link">Bibliothèque</router-link>
            <router-link to="/" class="nav-link">Déconnexion</router-link>
        </menu>
    </nav>
</template>

<script>

export default {
    name: "nav-bar",
    data() {
        return {
            library: this.$route.params.library
        };
    }
}
</script>

<style>
nav {
    position: sticky;
    top: 0;
    background-color: black;
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
}
</style>