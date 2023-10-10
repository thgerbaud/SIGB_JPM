<template>
	<main>
		<!--
			<div class="col-md-8">
				<div class="input-group mb-3">
					<input type="text" class="form-control" placeholder="Search by title"
						v-model="title"/>
					<div class="input-group-append">
						<button class="btn btn-outline-secondary" type="button"
							@click="searchTitle"
						>
							Search
						</button>
					</div>
				</div>
			</div>
		-->
		<div class="col-md-6">
			<h1>Ma bibliothèque</h1>
			<section id="books-list">
				<router-link v-for="(book, index) in books" :key="index" :to="`/`">
					<div class="book-preview">
						<img :src="book.image" alt="couverture" class="book-cover">
						<legend class="book-title">
							{{ book.title }}
						</legend>
						<legend class="book-authors">
							{{ book.author.join(" ") }}
						</legend>
					</div>
				</router-link>
			</section>
			<!--
			<ul class="list-group">
				<li class="list-group-item" :class="{ active: index == currentIndex }" v-for="(book, index) in books"
					:key="index" @click="setActiveBook(book, index)">
					{{ book.title }}
				</li>
			</ul>
		-->
			<button id="add-book" @click="addBook">+ ajouter un livre</button>

		</div>
		<div class="col-md-6">
			<div v-if="currentBook">
				<h4>Détail</h4>
				<div>
					<label><strong>Title :</strong></label> {{ currentBook.title }}
				</div>
				<img :src="currentBook.image" alt="couverture">
				<div>
					<label><strong>Auteur(s) :</strong></label> {{ currentBook.author.join(" ") }}
				</div>
				<div>
					<p>{{ currentBook.description }}</p>
				</div>
				<div>
					<label><strong>Publication :</strong></label> {{ currentBook.publication }}
				</div>
				<div>
					<label><strong>ISBN :</strong></label> {{ currentBook.isbn }}
				</div>
				<div>
					<label><strong>Code :</strong></label> {{ currentBook.code }}
				</div>
				<div>
					<label><strong>Localisation :</strong></label> {{ currentBook.location }}
				</div>

				<!---
				<a class="badge badge-warning" :href="'/books/' + currentBook.id">
					Edit
				</a>
			-->
			</div>
			<div v-else>
				<br />
				<p>Cliquez sur un livre pour afficher les détails...</p>
			</div>
		</div>
	</main>
</template>
	
<script>
import BookDataService from "../services/BookDataService";

export default {
	name: "books-list",
	data() {
		return {
			library: this.$route.params.library,
			books: [],
			currentBook: null,
			currentIndex: -1,
			title: ""
		};
	},
	methods: {
		retrieveBooks() {
			BookDataService.getAll(this.library)
				.then(response => {
					console.log(response.data)
					this.books = response.data.books;
					console.log(this.books);
				})
				.catch(e => {
					console.log(e);
				});
		},

		addBook() {
			this.$router.push(`/${this.library}/books/add`);
		},

		refreshList() {
			this.retrieveBooks();
			this.currentBook = null;
			this.currentIndex = -1;
		},

		setActiveBook(book, index) {
			this.currentBook = book;
			this.currentIndex = index;
		},

		removeAllBooks() {
			BookDataService.deleteAll()
				.then(response => {
					console.log(response.data);
					this.refreshList();
				})
				.catch(e => {
					console.log(e);
				});
		},

		searchTitle() {
			BookDataService.findByTitle(this.title)
				.then(response => {
					this.books = response.data;
					console.log(response.data);
				})
				.catch(e => {
					console.log(e);
				});
		}
	},
	mounted() {
		this.retrieveBooks();
	}
};
</script>
	
<style>
#books-list {
	display: flex;
}

#books-list .book-cover {
	height: 200px;
}

#books-list .book-preview {
	width: 200px;
}

.book-preview .book-title {
	color: black;
	font-weight: bold;
}

.book-preview .book-authors {
	color: dimgray;
}

button#add-book {
	margin-top: 1rem;
}
</style>