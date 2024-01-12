<template>
	<section class="col-md-6">
		<h2 class="text-h2">Ma bibliothèque</h2>
		<BooksSection :library="library" />
		<v-btn v-if="library.isAdmin" prepend-icon="mdi-plus" @click="$router.push(`/${library.id}/books/add`)"> ajouter un livre</v-btn>
	</section>
</template>
	
<script>
import BooksSection from '@/components/library/home/BooksSection.vue';
export default {
	props: ["library"],
	components: {
		BooksSection
	},
};
</script>