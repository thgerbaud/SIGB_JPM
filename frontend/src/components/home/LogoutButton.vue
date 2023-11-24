<template>
    <div class="center-content" id="logout-btn">
        <button class="tertiary" @click="logout">Déconnexion</button>
    </div>
</template>

<script>
export default {
    methods: {
        logout() {
			if (confirm("Se déconnecter ?")) {
				this.$store.commit('logout');
				this.$router.push('/');
			}
		}
    }
}
</script>

<style scoped>
#logout-btn {
	margin-top: 3rem;
}
</style>