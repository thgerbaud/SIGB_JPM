<template>
	<v-snackbar v-model="successSnackbar" color="primary" timeout="3000">
		<v-icon icon="mdi-check-circle-outline"></v-icon>
		Livre mis à jour.
	</v-snackbar>

	<div v-if="!loaded">
		<v-skeleton-loader type="card"></v-skeleton-loader>
	</div>

	<div v-else-if="errorMet" class="text-center empty-section ma-4">
		<v-icon icon="mdi-book-alert-outline" size="x-large" class="mb-4"></v-icon>
		<p>
			Impossible de récupérer les informations du livre.<br>
			Essayez de rafaîchir la page, si l'erreur persiste veuillez réessayer plus tard.
		</p>
	</div>

	<div v-else>
		<BookCard :book="book" :library="library" @update="updateBook" />

		<BookToolBar :book="book" :library="library" v-if="library.isAdmin" @update="updateBook" />
	</div>
</template>
  
<script>
import BookCard from '@/components/book/BookCard.vue';
import BookToolBar from '@/components/book/BookToolBar.vue';
import { getBookFromIsbn } from '@/services/GoogleBookService';
import BookDataService from '@/services/BookDataService';
export default {
	props: ["library"],
	data() {
		return {
			id: this.$route.params.id,
			book: null,
			loaded: false,
			errorMet: false,
			successSnackbar: false,
			infoDialog: false
		};
	},
	components: {
		BookCard,
		BookToolBar,
	},
	methods: {
		getBook() {
			BookDataService.get(this.id)
				.then(book => {
					this.book = book;
					return getBookFromIsbn(book.isbn);
				})
				.then(details => {
					this.book.details = details;
				})
				.catch(err => {
					if (err.message.includes(401)) {
						this.globalEmitter.emit('401');
					} else if (err.message.includes(403)) {
						this.globalEmitter.emit('403');
					} else if (err.message.includes(404)) {
						this.globalEmitter.emit('404');
					} else if (err.message.includes(500)) {
						this.globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
					} else {
						this.globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
					}
					this.errorMet = true;
				})
				.finally(() => {
					this.loaded = true;
				});
		},
		updateBook(updatedBook) {
			updatedBook.details = this.book.details;
			this.book = updatedBook;
			this.successSnackbar = true;
		}
	},
	created() {
		this.getBook();
	},
};
</script>