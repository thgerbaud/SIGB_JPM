<template>
	<div v-if="library">
		<NavBar :library="library"/>
		<router-view></router-view>
	</div>
</template>

<script>
import LibraryDataService from "../services/LibraryDataService";
import NavBar from "../components/NavBar.vue";

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
				.then(res => {
					this.library = res.data;
					console.log(this.library);
				})
				.catch(e => {
					console.log(e);
				});
		}

	},
	mounted() {
		this.retrieveLibrary();
	}
};
</script>

<style></style>