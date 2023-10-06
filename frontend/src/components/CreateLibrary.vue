<template>
	<div>

		<div v-if="!submitted">
			<h1>Créer une nouvelle bibliothèque</h1>
			<label for="name">Nom :</label>
			<input type="text" id="name" required v-model="library.name" name="name" />
			<button @click="saveLibrary">Ajouter</button>
			<router-link :to="'/'+user+'/libraries'">Annuler</router-link>
		</div>

		<div v-else>
			bibliothèque créée !
			<router-link :to="'/'+user+'/libraries'">Y aller</router-link>
			<router-link :to="'/'+user+'/libraries'">Revenir à l'accueil</router-link>
		</div>

	</div>
</template>

<script>
import LibraryDataService from '@/services/LibraryDataService';

export default {
	name: "create-library",
	data() {
		return {
			user: this.$route.params.user,
			library: {
				name: "",
				admin: []
			},
			submitted: false
		};
	},
	methods: {
		saveLibrary() {
			const data = {
				name: this.library.name,
				admin: [this.user],
				books: []
			};

			LibraryDataService.create(this.user, data)
				.then(response => {
					this.library.id = response.data.id;
					console.log(response.data);
					this.submitted = true;
				})
				.catch(e => {
					console.log(e);
				});
		}
	}
};

</script>