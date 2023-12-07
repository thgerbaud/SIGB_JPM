<template>
	<main class="center-content" id="create-main" v-if="!created">
		<div>
			<h1>Créer une nouvelle bibliothèque</h1>

			<div id="carousel">
				<NameStep v-if="currentIndex === 0" :step="1" :currentName="library.name" @setName="setName" />
				<LocationStep v-if="currentIndex === 1" :step="2" :currentLocations="library.locations"
					@previous="prevSlide" @setLocations="setLocations" />
				<CategoriesStep v-if="currentIndex === 2" :step="3" :currentCategories="library.categories"
					@previous="prevSlide" @setCategories="setCategories" />
			</div>
		</div>
		<button @click="returnHome" class="btn-cancel">Annuler</button>

	</main>
	<main class="center-content" v-else>
		<h2>Bibliothèque créée !</h2>
		<button @click="goToLibrary">Entrer dans ma bibliothèque</button>
		<button class="tertiary" @click="$router.push(`/home/libraries/`);">Revenir à l'accueil</button>
	</main>
</template>

<script>
import LibraryDataService from '@/services/LibraryDataService';

import NameStep from './library/NameStep.vue';
import LocationStep from './library/LocationStep.vue';
import CategoriesStep from './library/CategoriesStep.vue';

export default {
	name: "create-library",
	data() {
		return {
			user: this.$store.state.user,
			currentIndex: 0,
			totalSteps: 3,
			library: {
				name: "",
				admin: [],
				locations: [],
				categories: ['', '', '']
			},
			created: false
		};
	},
	components: {
		NameStep,
		LocationStep,
		CategoriesStep
	},
	methods: {
		prevSlide() {
			this.currentIndex = (this.currentIndex - 1 + this.totalSteps) % this.totalSteps;
		},
		nextSlide() {
			this.currentIndex = (this.currentIndex + 1) % this.totalSteps;
		},
		setName(newName) {
			this.library.name = newName;
			this.nextSlide();
		},
		setLocations(newLocations) {
			this.library.locations = newLocations;
			this.nextSlide();
		},
		setCategories(newCategories) {
			this.library.categories = newCategories;
			this.saveLibrary();
		},
		saveLibrary() {
			this.library.admin.push(this.user.email);
			LibraryDataService.create(this.library)
				.then(response => {
					this.library.id = response.data._id;
					console.log(response.data);
					this.created = true;
				})
				.catch(e => {
					console.log(e);
				});
		},
		returnHome() {
			if (confirm("Annuler la création ? Les données entrées seront perdues.")) {
				this.$router.push(`/home/libraries/`);
			}
		},
		goToLibrary() {
			this.$router.push(`/${this.library.id}/books`);
		}
	},
	beforeCreate() {
		if (!this.$store.getters.isLoggedIn) {
			this.$router.push('/');
		}
	},
};

</script>

<style scoped>
#create-main {
	padding: 3rem;
	justify-content: space-between;
	height: calc(100vh - 6rem);
}

h1 {
	text-align: center;
}

#carousel {
	max-width: 500px;
	margin: auto;
	text-align: justify;
}
</style>