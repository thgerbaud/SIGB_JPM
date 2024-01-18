<template>
	<NavBar :library="library" v-if="library" />
	<v-main class="ma-4 bg-tertiary">
		<router-view :library="library" v-if="library"></router-view>
	</v-main>
</template>

<script>
import LibraryDataService from '@/services/LibraryDataService';
import NavBar from '@/components/utils/nav/NavBar.vue';
export default {
	components: { NavBar },
	data() {
		return {
			library: this.$store.getters.getLibrary
		};
	},
	methods: {
		async retrieveLibrary() {
			if (this.library?.id !== this.$route.params.library) {
				alert("Fetching library");
				await LibraryDataService.getLibrary(this.$route.params.library)
					.then(data => {
						this.library = data;
						console.log(this.library);
					})
					.catch(e => {
						console.log(e); //TODO
					});
			}
		},
	},
	async created() {
		await this.retrieveLibrary();
	}
};
</script>