<template>
    <nav>
        <menu>
            <router-link :to="`/${library._id}/books`" class="nav-link">{{ library.name }}</router-link>
            <router-link to="/" class="nav-link">Bibliothèques</router-link>
        </menu>
        <div id="profile">
            <span>{{ user.name }}</span>
            <img id="profile-picture" :src="user.picture">
            <div v-if="toggle" id="profile-toggle">
                <div id="email">{{ user.email }}</div>
                <div id="logout" @click="logout">Déconnexion</div>
            </div>
        </div>
    </nav>
</template>

<script>

export default {
    name: "nav-bar",
    props: ["library"],
    data() {
        return {
            user: this.$store.state.user,
            toggle: false
        };
    },
    methods: {
        logout() {
            if (confirm("Se déconnecter ?")) {
                this.$store.commit('logout');
                this.$router.push('/');
            }
        }
    },
    created() {
        const self = this;
        document.addEventListener('click', (e) => {
            if (document.getElementById('profile').contains(e.target)) {
                self.toggle = true;
            } else {
                self.toggle = false;
            }
        });
    }
}
</script>

<style scoped>
nav {
    position: sticky;
    top: 0;
    background-color: var(--primary);
    padding: 0.5rem 1rem;
    display: flex;
    font-size: var(--medium2);
    color: var(--white);
    gap: 1rem;
}

menu {
    margin: 0;
    padding: 0;
    flex-grow: 1;

}

menu,
#profile {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.nav-link {
    color: var(--white);
    text-decoration: none;
}

#profile {
    position: relative;
    cursor: pointer;
}

#profile-picture {
    height: 3rem;
    border-radius: 50%;
}

#profile-toggle {
    background-color: var(--secondary);
    padding: 0.5rem 0rem;
    position: absolute;
    right: 0;
    top: 4rem;
    border-radius: 5px;
    font-size: var(--medium1);
}

#profile-toggle>div {
    padding: 0.5rem 1rem;
    text-align: center;
}

#email {
    color: var(--label-color);
    font-style: italic;
    cursor: text;
}

#logout:hover {
    backdrop-filter: brightness(60%);
}
</style>