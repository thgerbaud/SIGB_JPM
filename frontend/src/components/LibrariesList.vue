<template>
	<main class="center-content">
		<section>
			<h2 class="center-content">Bienvenue, {{ user.name }}</h2>
			<div id="libraries-view">
				<h1>Mes bibliothèques :</h1>
				<div v-if="libraries.length == 0"><i>Aucune bibliothèque pour le moment</i></div>
				<div v-else id="libraries-list">
					<router-link v-for="(library, index) in libraries" :key="index" class="library-item"
						:to="`/${library._id}/books`">
						<div class="library-name">{{ library.name }}</div>
						<div>></div>
					</router-link>
				</div>
				<router-link :to="`/${user}/create`" id="create-library-section">
					<button id="create-library-btn" class="secondary">+ créer une bibliothèque</button>
				</router-link>
			</div>
			<router-link to="/" class="center-content">
				<button class="tertiary" @click="logout">Déconnexion</button>
			</router-link>
		</section>
	</main>
</template>

<script>
import LibraryDataService from "../services/LibraryDataService";

export default {
	name: "libraries-list",
	data() {
		return {
			libraries: [],
			user: this.$store.state.user
		};
	},
	methods: {
		retrieveLibraries() {
			LibraryDataService.getAll(this.user.email)
				.then(response => {
					this.libraries = response.data;
					console.log(response.data);
				})
				.catch(e => {
					console.log(e);
				});
		},

		refreshList() {
			this.retrieveLibraries();
		},

		logout() {
            if(confirm("Se déconnecter ?")) {
                this.$store.commit('logout');
                this.$router.push('/');
            }
        }
	},
	mounted() {
		this.retrieveLibraries();
	}
};
</script>

<style>
#libraries-view {
	min-width: 300px;
}

#libraries-list {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.library-item {
	font-size: 1.5rem;
	padding: 0.5rem 1rem;
	border-radius: 5px;
	background-color: rgba(228, 228, 228, 0.5);
	border: 1px solid rgb(150, 150, 150);
	color: black;
	text-decoration: none;
	display: flex;
}

.library-item:hover {
	box-shadow: 0 2px 5px rgb(150, 150, 150);
}

.library-name {
	flex-grow: 1;
}

#create-library-section {
	margin-top: 1rem;
	display: flex;
	text-decoration: none;
}

#create-library-btn {
	flex-grow: 1;
}
</style>