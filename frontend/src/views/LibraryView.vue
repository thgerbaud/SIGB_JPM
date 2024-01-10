<template>
	<NavBar :library="library" v-if="library" />
	<v-main class="ma-4 bg-tertiary">
		<router-view :library="library" v-if="library"></router-view>
	</v-main>
</template>

<script>
import LibraryDataService from '@/services/LibraryDataService';
import NavBar from '@/components/utils/NavBar.vue';
export default {
	components: { NavBar },
	data() {
		return {
			library: null
		};
	},
	methods: {
		retrieveLibrary() {
			const currentLibrary = this.$store.getters.getLibrary;
			console.log(currentLibrary);
			if (currentLibrary.id !== this.$route.params.library) {
				alert("Fetching library");
				LibraryDataService.getLibrary(this.$route.params.library)
					.then(data => {
						this.library = data;
						console.log(this.library);
					})
					.catch(e => {
						console.log(e);
					});
			} else {
				this.library = currentLibrary;
			}
		}
	},
	created() {
		this.retrieveLibrary();
		//this.library = this.$store.getters.getLibrary;
	}
};
</script>