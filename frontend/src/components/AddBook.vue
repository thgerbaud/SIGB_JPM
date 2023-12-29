<template>
	<main>
		<section class="submit-form">
			<div v-if="!submitted">
				<h2>Ajouter un livre</h2>
				<div class="form-group">
					<label for="isbn">ISBN :</label>
					<input type="text" class="form-control" id="isbn" required v-model="book.isbn" name="isbn"
						placeholder="N° ISBN à 10 ou 13 chiffres" />
				</div>

				<div class="form-group">
					<label for="code">Code :</label>
					<input type="text" class="form-control" id="code" required v-model="book.code" name="code"
						placeholder="Identifiant unique" />
				</div>

				<div class="form-group">
					<label for="location">Localisation: </label>
					<select class="from-control" id="location" required v-model="book.location" name="location">
						<option value="">Non précisée</option>
						<option v-for="(location, index) in library.locations" :key="index">{{ location }}</option>
					</select>
				</div>

				<div class="form-group">
					<label for="category">Catégorie :</label>
					<select class="from-control" id="category" required v-model="book.category" name="category">
						<option value="">Non précisée</option>
						<option v-for="(category, index) in library.categories" :key="index">{{ category }}</option>
					</select>
				</div>

				<menu id="form-menu">
					<button @click="cancel" class="btn btn-cancel">Annuler</button>
					<button @click="saveBook" class="btn btn-success">Ajouter</button>
				</menu>
			</div>

			<div v-else>
				<h4>Livre ajouté !</h4>
				<button @click="cancel" class="tertiary">Retour</button>
			</div>
		</section>
	</main>
</template>
  
<script>
import BookDataService from "../services/BookDataService";

export default {
	name: "add-book",
	props: ["library"],
	data() {
		return {
			book: {
				isbn: null,
				code: "",
				location: "",
				category: ""
			},
			submitted: false
		};
	},
	methods: {
		saveBook() {
			var data = {
				isbn: this.book.isbn,
				code: this.book.code,
				location: this.book.location
			};

			BookDataService.create(this.library.id, data)
				.then(response => {
					this.book.id = response.data.id;
					console.log(response.data);
					this.submitted = true;
				})
				.catch(e => {
					console.log(e);
				});
		},

		newBook() {
			this.submitted = false;
			this.book = {};
		},

		cancel() {
			this.$router.push(`/${this.library.id}/books/`);
		}
	}
};
</script>
  
<style></style>