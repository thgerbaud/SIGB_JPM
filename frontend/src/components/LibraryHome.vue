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
		<section class="col-md-6">
			<h1>Ma bibliothèque</h1>
			<BooksList :books="books"/>
			<button id="add-book-btn" @click="addBook">+ ajouter un livre</button>

		</section>
	</main>
</template>
	
<script>
import BooksList from "./BooksList.vue";
import BookDataService from "../services/BookDataService";

export default {
	name: "library-home",
    components: {
        BooksList
    },
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
	
<style scoped>
#add-book-btn {
	margin-top: 1rem;
}
</style>