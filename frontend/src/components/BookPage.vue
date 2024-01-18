<template>
	<ExpiredSessionDialog v-model="expiredSessionDialog" />

	<ErrorDialog v-model="errorDialog" :message="errorMessage" @close="errorDialog = false" />

	<NotFoundDialog v-model="notFoundDialog" @ok="notFoundDialog = false" /> <!-- redirection ? -->

	<AccessDeniedDialog v-model="accessDeniedDialog" @ok="accessDeniedDialog = false" /> <!-- redirection ? -->

	<InfoDialog v-model="infoDialog" @ok="$router.push(`/${library.id}/books`)" title="Livre supprimé"
		message="Votre livre a bien été supprimé, vous allez être redirigé vers la page d'accueil de la bibliothèque." />

	<v-snackbar v-model="successSnackbar" color="primary" timeout="3000">Livre mis à jour.</v-snackbar>

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
		<BookCard :book="book" :library="library" />

		<BookToolBar :book="book" :library="library" v-if="library.isAdmin" @update="updateBook" @delete="deleteBook" />
	</div>
</template>
  
<script>
import BookCard from '@/components/book/BookCard.vue';
import BookToolBar from '@/components/book/BookToolBar.vue';
import ExpiredSessionDialog from '@/components/utils/dialogs/ExpiredSessionDialog.vue';
import ErrorDialog from '@/components/utils/dialogs/ErrorDialog.vue';
import NotFoundDialog from '@/components/utils/dialogs/NotFoundDialog.vue';
import AccessDeniedDialog from '@/components/utils/dialogs/AccessDeniedDialog.vue';
import InfoDialog from '@/components/utils/dialogs/InfoDialog.vue';
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
			expiredSessionDialog: false,
			errorDialog: false,
			notFoundDialog: false,
			accessDeniedDialog: false,
			errorMessage: "Oups, une erreur s'est produite...",
			successSnackbar: false,
			infoDialog: false,
		};
	},
	components: {
		BookCard,
		BookToolBar,
		ExpiredSessionDialog,
		ErrorDialog,
		NotFoundDialog,
		AccessDeniedDialog,
		InfoDialog,
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
					this.processError(err);
					this.errorMet = true;
				})
				.finally(() => {
					this.loaded = true;
				});
		},

		updateBook(data) {
			BookDataService.update(this.book.id, data)
				.then(book => {
					book.details = this.book.details;
					this.book = book;
					this.successSnackbar = true;
				})
				.catch(err => {
					this.processError(err);
				});
		},

		deleteBook() {
			BookDataService.delete(this.book.id)
				.then(() => {
					this.infoDialog = true;
				})
				.catch(err => {
					this.processError(err);
				});
		},

		processError(err) {
			if (err.message.includes(401)) {
				this.expiredSessionDialog = true;
			} else if (err.message.includes(403)) {
				this.accessDeniedDialog = true;
			} else if (err.message.includes(404)) {
				this.notFoundDialog = true;
			} else if (err.message.includes(500)) {
				this.errorMessage = "Oups! Une erreur s'est produite du côté du serveur...";
				this.errorDialog = true;
			} else {
				this.errorMessage = "Oups! Une erreur inattendue s'est produite...";
				this.errorDialog = true;
			}
		},
	},
	created() {
		this.getBook();
	},
};
</script>