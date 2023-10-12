<template>
	<main>
		<section v-if="book" class="edit-form">

			<h3>{{ book.title }}</h3>

			<img :src="book.image">
			<h4>Auteur(s) :</h4>
			{{ book.author.join(" ") }}
			<h4>Date de publication :</h4>
			{{ book.publication }}
			<h4>ISBN :</h4>
			{{ book.isbn }}
			<h4>Description :</h4>
			<p>{{ book.description }}</p>

			<form>
				<div class="form-group">
					<label for="isbn">ISBN</label>
					<input type="text" class="form-control" id="isbn" v-model="book.isbn" />
				</div>
				<div class="form-group">
					<label for="code">Code</label>
					<input type="text" class="form-control" id="code" v-model="book.code" />
				</div>
				<div class="form-group">
					<label for="location">Location</label>
					<input type="text" class="form-control" id="location" v-model="book.location" />
				</div>


			</form>


			<button class="badge badge-danger mr-2" @click="deleteBook">
				Delete
			</button>

			<button type="submit" class="badge badge-success" @click="updateBook">
				Update
			</button>
			<p>{{ message }}</p>
		</section>

		<section v-else>
			<br />
			<p>Please click on a Book...</p>
		</section>
	</main>
</template>
  
<script>
import BookDataService from "../services/BookDataService";

export default {
	name: "book-item",
	data() {
		return {
			id: this.$route.params.id,
			library: this.$route.params.library,
			book: null,
			message: ''
		};
	},
	methods: {
		getBook(library, id) {
			BookDataService.get(library, id)
				.then(response => {
					this.book = response.data.books[0];
				})
				.catch(e => {
					console.log(e);
				});
		},

		updateBook() {
			BookDataService.update(this.book.id, this.book)
				.then(response => {
					console.log(response.data);
					this.message = 'The book was updated successfully!';
				})
				.catch(e => {
					console.log(e);
				});
		},

		deleteBook() {
			BookDataService.delete(this.book.id)
				.then(response => {
					console.log(response.data);
					this.$router.push({ name: "book" });
				})
				.catch(e => {
					console.log(e);
				});
		}
	},
	mounted() {
		this.getBook(this.library, this.id);
	}
};
</script>
  
<style></style>