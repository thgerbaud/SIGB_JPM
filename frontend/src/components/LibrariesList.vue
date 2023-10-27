<template>
	<main>
		<section v-if="user">
			<div id="user-infos">
				<img id="user-picture" :src="user.picture" alt="User picture">
				<h2>Bienvenue, {{ user.name }}</h2>
			</div>
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
				<router-link to="/home/create" id="create-library-section">
					<button id="create-library-btn" class="secondary">+ créer une bibliothèque</button>
				</router-link>
			</div>
			<div class="center-content" id="logout-btn">
				<button class="tertiary" @click="logout">Déconnexion</button>
			</div>
		</section>
		<section v-else>
			Seems you're logged out...
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
			if (!this.$store.getters.isLoggedIn) {
				return;
			}
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
			if (confirm("Se déconnecter ?")) {
				this.$store.commit('logout');
				this.$router.push('/');
			}
		}
	},
	beforeCreate() {
		if (!this.$store.getters.isLoggedIn) {
			this.$router.push('/');
		}
	},
	created() {
		this.retrieveLibraries();
	}
};
</script>

<style scoped>
section {
    color: var(--white);
}

#user-infos {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 3rem;
}

#user-picture {
	height: 4rem;
	border-radius: 2rem;
}

#libraries-view {
	min-width: 300px;
}

#libraries-list {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin: 0 5rem;
}

.library-item {
	font-size: var(--medium3);
	padding: 1rem 1.5rem;
	border-radius: 5px;
	background-color: var(--primary-light);
	color: white;
	text-decoration: none;
	display: flex;
}

.library-item:hover {
	opacity: 60%;
}

.library-name {
	flex-grow: 1;
}

#create-library-section {
	margin: 1rem 5rem;
	display: flex;
	text-decoration: none;
}

#create-library-btn {
	flex-grow: 1;
    color: var(--white);
	padding: 1rem 1.5rem;
}

#logout-btn {
	margin-top: 3rem;
}
</style>