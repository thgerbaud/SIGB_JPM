<template>
	<main>
		<section class="edit-form">

			<header>
				<div id="header-infos">
					<h1>{{ book.title }}</h1>
					<legend id="authors">{{ book.author.join(" ") }}</legend>
					<p id="description">{{ book.description }}</p>
				</div>
				<img id="cover-image" :src="book.image">
			</header>


			<span class="label">Date de publication :</span> {{ book.publication }}
			<br>
			<span class="label">ISBN :</span> {{ book.isbn }}
			<br>
			<span class="label">Code :</span> {{ book.code }}
			<br>
			<span class="label">Localisation :</span> {{ book.location }}

			<!--
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
		-->
		</section>

		<menu>
			<button class="btn-cancel" @click="deleteBook">
				Supprimer
			</button>

			<button type="submit" class="badge badge-success" @click="updateBook">
				Modifier
			</button>
			</menu>

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
  
<style scoped>
header {
	display: flex;
	gap: 1rem;
}

h1 {
	margin: 0;
}

#header-infos {
	flex-grow: 1;
}

#authors {
	font-size: var(--medium3);
	color: var(--label-color);
}

#description {
	text-align: justify;
}

#cover-image {
	height: 300px;
}

.label {
	font-weight: bold;
}

menu {
	justify-content: right;
}
</style>