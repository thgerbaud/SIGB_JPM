<template>
    <nav>
        <menu>
            <router-link :to="`/${library.id}/books`" class="nav-link">{{ library.name }}</router-link>
        </menu>
        <div id="profile">
            <span id="profile-name">{{ user.name }}</span>
            <img id="profile-picture" :src="user.picture" referrerpolicy="no-referrer">
            <div v-if="toggle" id="profile-toggle">
                <div id="email" class="toggle-item">{{ user.email }}</div>
                <div id="libraries" class="nav-link toggle-item" @click="exitLibrary">Mes bibliothèques</div>
                <div id="logout" @click="logout" class="toggle-item">Déconnexion</div>
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
        },
        exitLibrary() {
            if (confirm(`Quitter la bibliothèque ${this.library.name} ?`)) {
                this.$router.push('/home/libraries');
            }
        },
        listener(e) {
            if (document.getElementById('profile-name').contains(e.target)) {
                this.toggle = !this.toggle;
            } else if (this.toggle && !document.getElementById('profile-toggle').contains(e.target)) {
                this.toggle = false;
            }
        }
    },
    created() {
        document.addEventListener('click', this.listener);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.listener);
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
    background-color: var(--primary-light);
    padding: 0;
    position: absolute;
    right: 0;
    top: 4rem;
    border-radius: 10px;
    font-size: var(--medium1);
}

#email {
    font-style: italic;
    cursor: text;
    padding: 1.5rem;
    text-align: center;
    border-radius: 10px 10px 0 0;
    background-color: var(--primary-light);
}

#logout, #libraries {
    padding: 1rem;
    background-color: var(--primary);
}

#logout {
    border-top: solid 1px var(--primary-light);
    border-radius: 0 0 10px 10px;
}

#logout:hover, #libraries:hover {
    color: var(--primary-light);
}
</style>