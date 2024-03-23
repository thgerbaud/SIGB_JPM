<template>
	<v-snackbar v-model="successSnackbar" color="primary" timeout="3000">
		<v-icon icon="mdi-check-circle-outline"></v-icon>
		{{ successMessage }}
	</v-snackbar>

	<div v-if="!loaded">
		<v-skeleton-loader type="card"></v-skeleton-loader>
	</div>

	<div v-else-if="errorMet" class="text-center font-italic text-disabled ma-4">
		<v-icon icon="mdi-book-alert-outline" size="x-large" class="mb-4"></v-icon>
		<p>
			Impossible de récupérer les informations du livre.<br>
			Essayez de rafaîchir la page, si l'erreur persiste veuillez réessayer plus tard.
		</p>
	</div>

	<div v-else>
		<DetailsSection :book="book" :library="library" @update="updateBook" />

		<BookToolBar :book="book" :library="library" v-if="library.isAdmin" @update="updateBook" />

		<CopiesSection :book="book" :library="library" @update="updateBook" />

		<CommentsSection :book="book" @update="updateBook"/>
	</div>
</template>
  
<script setup>
import { ref, inject } from 'vue';
import { useRoute } from 'vue-router';
import DetailsSection from '@/components/book/DetailsSection.vue';
import BookToolBar from '@/components/book/BookToolBar.vue';
import CopiesSection from '@/components/book/copies/CopiesSection.vue';
import CommentsSection from '@/components/book/comments/CommentsSection.vue';
import { getBookFromIsbn } from '@/services/GoogleBookService';
import { getBook } from '@/services/BookDataService';

defineProps(["library"]);
const route = useRoute();
const globalEmitter = inject('globalEmitter');

const id = route.params.book;
const book = ref(null);
const loaded = ref(false);
const errorMet = ref(false);
const successSnackbar = ref(false);
const defaultSuccessMessage = "Livre mis à jour";
const successMessage = ref(defaultSuccessMessage);

function retreiveBook() {
	getBook(id)
		.then(data => {
			book.value = data;
			return getBookFromIsbn(data.isbn);
		})
		.then(details => {
			book.value.details = details;
		})
		.catch(err => {
			//TODO 400
			if (err.message.includes(401)) {
				globalEmitter.emit('401');
			} else if (err.message.includes(403)) {
				globalEmitter.emit('403');
			} else if (err.message.includes(404)) {
				globalEmitter.emit('404');
			} else if (err.message.includes(500)) {
				globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
			} else {
				globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
			}
			errorMet.value = true;
		})
		.finally(() => {
			loaded.value = true;
		});
}

function updateBook(updatedBook, message) {
	updatedBook.details = book.value.details;
	book.value = updatedBook;
	successMessage.value = message || defaultSuccessMessage;
	successSnackbar.value = true;
}

retreiveBook();
</script>