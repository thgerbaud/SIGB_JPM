<template>
	<div id="books-list">
		<router-link v-for="(book, index) in books" :key="index" :to="`/${library}/books/${book._id}`">
			<BooksListItem :book="book"/>
		</router-link>
	</div>
</template>
	
<script>
import BooksListItem from './BooksListItem.vue';

export default {
    name: "books-list",
	components: { BooksListItem },
    props: ["books", "library"]
};
</script>
	
<style scoped>
#books-list {
	display: flex;
	gap: 1rem;
}
</style>