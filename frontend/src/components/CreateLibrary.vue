<template>
	<main>
		<section class="submit-form">

			<div v-if="!submitted">
				<h2>Créer une nouvelle bibliothèque</h2>

				<div class="form-group">
					<label for="name">Nom</label>
					<input type="text" id="name" required v-model="library.name" name="name"
						placeholder="Nom de la bibliothèque" />
				</div>

				<menu id="form-menu">
					<button @click="returnHome" class="btn-cancel">Annuler</button>
					<button @click="saveLibrary">Ajouter</button>
				</menu>
			</div>

			<div v-else>
				<h2>Bibliothèque créée !</h2>
				<button @click="goToLibrary">Y aller</button>
				<button @click="returnHome" class="secondary">Revenir aux bibliothèques</button>
			</div>

		</section>
	</main>
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
		},
		returnHome() {
			this.$router.push(`/${this.user}/libraries/`);
		},
		goToLibrary() {
			this.$router.push(`/${this.library.id}/books`);
		}
	}
};

</script>