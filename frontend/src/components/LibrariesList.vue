<template>
	<div>
		<h1>Bienvenue, {{ user }}</h1>
		<h2>Mes bibliothèques :</h2>
		<div v-if="libraries.length == 0">Aucune bibliothèque pour le moment</div>
		<div v-else>
			<ul>
				<li v-for="(library, index) in libraries" :key="index">
					<router-link :to="`/${library._id}/books`">{{ library.name }}</router-link>
				</li>
			</ul>
		</div>
		<router-link :to="`/${user}/create`">
			<button>+ créer une bibliothèque</button>
		</router-link>
		<router-link to="/">
			<button>Déconnexion</button>
		</router-link>
	</div>
</template>

<script>
import LibraryDataService from "../services/LibraryDataService";

export default {
	name: "libraries-list",
	data() {
		return {
			libraries: [],
			user: this.$route.params.user
		};
	},
	methods: {
		retrieveLibraries() {
			LibraryDataService.getAll(this.user)
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

		searchName() {
			LibraryDataService.findByName(this.name)
				.then(response => {
					this.libraries = response.data;
					console.log(response.data);
				})
				.catch(e => {
					console.log(e);
				});
		}
	},
	mounted() {
		this.retrieveLibraries();
	}
};
</script>