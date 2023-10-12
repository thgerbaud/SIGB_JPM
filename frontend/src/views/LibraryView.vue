<template>
    <div>
        <NavBar/>
        <router-view></router-view>
    </div>
</template>

<script>
import LibraryDataService from "../services/LibraryDataService";
import NavBar from "../components/NavBar.vue";

export default {
	name: "library-view",
    components: {NavBar},
	data() {
		return {
			library: this.$route.params.library
		};
	},
	methods: {
		retrieveLibrary() {
			LibraryDataService.get() //TODO
		}

	},
	mounted() {

	}
};
</script>

<style>
</style>