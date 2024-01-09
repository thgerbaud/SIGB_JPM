<template>
	<v-list-item :value="library"
		class="bg-primary-lighten-1 mb-3 pa-4 rounded-lg" @click="goToLibrary">
		<template v-slot:prepend>
			<v-icon icon="mdi-book-cog" v-if="library.isAdmin"></v-icon>
			<v-icon icon="mdi-book" v-else></v-icon>
		</template>
		<template v-slot:append>
			<v-icon icon="mdi-chevron-right"></v-icon>
		</template>
		<v-list-item-title v-text="library.name" class="text-h5"></v-list-item-title>
		<v-list-item-subtitle v-text="library.isAdmin ? 'administrateur' : 'invité'"></v-list-item-subtitle>
	</v-list-item>
</template>

<script>
export default {
	props: ["library"],
	methods: {
		goToLibrary() {
			this.$store.commit('setLibrary', this.library);
			this.$router.push(`/${this.library.id}/books`);
		}
	}
}
</script>