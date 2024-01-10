<template>
	<NotFoundDialog :isbn="book.isbn" v-model="notFoundDialog" @close="notFoundDialog = false" />

	<ErrorDialog v-model="errorDialog" @close="errorDialog = false" :message="errorMessage" />

	<FoundDialog :book="bookFound" v-model="foundDialog" @close="foundDialog = false" @add="saveBook" />

	<ConfirmDialog title="Annuler l'ajout du livre"
		text="Êtes-vous sûr de vouloir quitter la page ? Toutes les données entrées seront perdues."
		okText="Continuer l'ajout" cancelText="Quitter" v-model="confirmDialog" @ok="confirmDialog = false"
		@cancel="returnHome" />

	<AddSuccessDialog v-model="addSuccessDialog" :id="book.id" :code="book.code" :title="bookFound?.title"
		@addAnother="resetForm" @seeBook="$router.push(`/${library.id}/books/${book.id}`)" @goHome="returnHome" />

	<section>
		<v-form class="submit-form" @submit.prevent="searchBook" v-model="isFormValid" :disabled="submitted" ref="addForm">
			<h2>Ajouter un livre</h2>
			<v-text-field label="N° ISBN" variant="outlined" v-model="book.isbn" clearable
				hint="Code à 10 ou 13 chiffres, souvent situé en quatrième de couverture."
				:rules="[rules.required, rules.isbn_format, rules.isbn_length]" persistent-hint @input="handleIsbnInput"
				maxlength="13"></v-text-field>
			<v-text-field label="Code" variant="outlined" v-model="book.code" clearable
				hint="Choisissez un code unique pour identifier votre livre" :rules="[rules.required, rules.code]"
				persistent-hint maxlength="10" @input="handleCodeInput"></v-text-field>
			<v-select label="Localisation" variant="outlined"
				:items="library.locations.map((title, value) => ({ title, value }))" v-model="book.location" clearable
				hint="(optionnel)" persistent-hint></v-select>
			<v-select label="Catégorie" variant="outlined"
				:items="library.categories.map((title, value) => ({ title, value }))" v-model="book.category" clearable
				hint="(optionnel)" persistent-hint></v-select>
			<menu id="form-menu">
				<v-btn-cancel class="btn" @click="confirmDialog = true">Annuler</v-btn-cancel>
				<v-btn class="btn" type="submit" :loading="loading" :disabled="!isFormValid">Chercher</v-btn>
			</menu>
		</v-form>
	</section>
</template>
  
<script>
import BookDataService from '@/services/BookDataService';
import { getBookFromIsbn } from '@/services/GoogleBookService';
import NotFoundDialog from '@/components/library/add/NotFoundDialog';
import FoundDialog from '@/components/library/add/FoundDialog';
import ErrorDialog from '@/components/utils/ErrorDialog';
import ConfirmDialog from '@/components/utils/ConfirmDialog';
import AddSuccessDialog from '@/components/library/add/AddSuccessDialog';
export default {
	name: "add-book",
	props: ["library"],
	data() {
		return {
			rules: {
				required: (value) => !!value || "Champ obligatoire.",
				isbn_format: (value) => (/^[0-9]+$/.test(value)) || "Numéro invalide (ne doit contenir que des chiffres).",
				isbn_length: (value) => (value.length === 10 || value.length === 13) || "Doit contenir exactement 10 ou 13 chiffres.",
				code: (value) => (/^[a-zA-Z0-9]+$/.test(value)) || "Ne doit contenir que des chiffres et des lettres."
			},
			isFormValid: false,
			loading: false,
			notFoundDialog: false,
			errorDialog: false,
			foundDialog: false,
			confirmDialog: false,
			addSuccessDialog: false,
			book: {
				id: "",
				isbn: null,
				code: "",
				location: null,
				category: null
			},
			bookFound: null,
			submitted: false,
			errorMessage: "Oups! une erreur s'est produite..."
		};
	},
	components: {
		NotFoundDialog,
		ErrorDialog,
		FoundDialog,
		ConfirmDialog,
		AddSuccessDialog
	},
	methods: {
		handleIsbnInput() {
			this.book.isbn = this.book.isbn.replace(/\D/g, '');
		},
		handleCodeInput() {
			this.book.code = this.book.code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
		},
		async searchBook() {
			this.submitted = true;
			this.loading = true;
			getBookFromIsbn(this.book.isbn)
				.then(infos => {
					if (infos === null) {
						this.notFoundDialog = true;
					} else {
						this.bookFound = infos;
						this.foundDialog = true;
					}
				})
				.catch(err => {
					console.error(err); //!
					this.errorMessage = "Oups! une erreur s'est produite...";
					this.errorDialog = true;
				})
				.finally(() => {
					this.loading = false;
					this.submitted = false;
				});
		},
		saveBook() {
			const data = {
				isbn: this.book.isbn,
				code: this.book.code,
				location: this.book.location,
				category: this.book.category,
				library: this.library.id
			};
			BookDataService.create(data)
				.then(response => {
					this.book = response;
					console.log(response);
					this.foundDialog = false;
					this.addSuccessDialog = true;
				})
				.catch(err => {
					this.foundDialog = false;
					if (err.message.includes(401)) {
						this.$router.push('/login');
					} else if (err.message.includes(403)) {
						this.errorMessage = "Hmm... Il semblerait que vous n'ayez pas les permissions nécessaires pour effectuer cette action...";
						this.errorDialog = true;
					} else if (err.message.includes(400)) {
						this.errorMessage = err.message.includes("Duplicate") ? "Il semblerait que vous ayez déjà un livre identifié avec ce code. Veuillez choisir un code unique pour ce livre et réessayer..." : "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer...";
						this.errorDialog = true;
					} else if (err.message.includes(500)) {
						this.errorMessage = "Oups! Une erreur s'est produite du côté du serveur...";
						this.errorDialog = true;
					} else {
						this.errorMessage = "Oups! Une erreur inattendue s'est produite...";
						this.errorDialog = true;
					}
				});
		},
		returnHome() {
			this.$router.push(`/${this.library.id}/books/`);
		},
		resetForm() {
			this.book = {
				id: "",
				isbn: null,
				code: "",
				location: null,
				category: null
			};
			this.$refs.addForm.reset();
			this.addSuccessDialog = false;
		},
	}
};
</script>
