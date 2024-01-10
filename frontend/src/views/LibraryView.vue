<template>
	<NavBar :library="library" v-if="library" />
	<v-main class="ma-4">
		<router-view :library="library" v-if="library"></router-view>
	</v-main>
</template>

<script>
import LibraryDataService from '@/services/LibraryDataService';
import NavBar from '@/components/utils/NavBar.vue';

export default {
	name: "library-view",
	components: { NavBar },
	data() {
		return {
			library: null
		};
	},
	methods: {
		retrieveLibrary() {
			LibraryDataService.getLibrary(this.$route.params.library)
				.then(data => {
					this.library = data;
					console.log(this.library);
				})
				.catch(e => {
					console.log(e);
				});
		}

	},
	created() {
		document.body.id = 'light';
		//this.retrieveLibrary();
		this.library = this.$store.getters.getLibrary;
	}
};
</script>