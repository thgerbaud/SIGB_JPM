<template>
	<main>
		<section class="submit-form">

			<div v-if="!submitted">
				<h2>Créer une nouvelle bibliothèque</h2>

				<div class="form-group">
					<label for="name">Choisissez un nom pour votre bibliothèque :</label>
					<input type="text" id="name" required v-model="library.name" name="name"
						placeholder="Nom de la bibliothèque" />
				</div>

				<menu id="form-menu">
					<button @click="returnHome" class="btn-cancel">Annuler</button>
					<button @click="saveLibrary">Créer</button>
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
			user: this.$store.state.user,
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
				admin: [this.user.email],
				books: []
			};

			LibraryDataService.create(data)
				.then(response => {
					this.library.id = response.data._id;
					console.log(response.data);
					this.submitted = true;
				})
				.catch(e => {
					console.log(e);
				});
		},
		returnHome() {
			this.$router.push(`/home/libraries/`);
		},
		goToLibrary() {
			this.$router.push(`/${this.library.id}/books`);
		}
	},
	beforeCreate() {
        if(!this.$store.getters.isLoggedIn) {
            this.$router.push('/');
        }
    },
};

</script>

<style>
section {
    color: var(--white);
}
</style>