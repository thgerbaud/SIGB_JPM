<template>
	<p class="font-weight-bold mt-4">{{ books.title }} ({{ books.items.length }})</p>
	<v-divider class="border-opacity-25"></v-divider>
	<div id="books-list" class="my-4 d-flex flex-wrap" v-if="books.items && books.items.length > 0">
		<BooksListItem v-for="book in books.items" :key="book.id" :book="book" :libraryId="libraryId" />
	</div>
	<p class="my-4 font-italic text-disabled" v-else>Aucun livre correspondant</p>
</template>
	
<script setup>
import BooksListItem from '@/components/library/home/BooksListItem.vue';

defineProps(["libraryId", "books"]);
</script>