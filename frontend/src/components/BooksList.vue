<template>
	<div class="list row">
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
			<h4>Ma bibliothèque</h4>
			<ul class="list-group">
				<li class="list-group-item" :class="{ active: index == currentIndex }" v-for="(book, index) in books"
					:key="index" @click="setActiveBook(book, index)">
					{{ book.title }}
				</li>
			</ul>

			<button class="m-3 btn btn-sm btn-danger" @click="removeAllBooks">
				Remove All
			</button>
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
					<label><strong>Location :</strong></label> {{ currentBook.location }}
				</div>


				<a class="badge badge-warning" :href="'/books/' + currentBook.id">
					Edit
				</a>
			</div>
			<div v-else>
				<br />
				<p>Please click on a Book...</p>
			</div>
		</div>
	</div>
</template>
	
<script>
import BookDataService from "../services/BookDataService";

export default {
	name: "books-list",
	data() {
		return {
			books: [],
			currentBook: null,
			currentIndex: -1,
			title: ""
		};
	},
	methods: {
		retrieveBooks() {
			BookDataService.getAll()
				.then(response => {
					this.books = response.data;
					console.log(response.data);
				})
				.catch(e => {
					console.log(e);
				});
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
.list {
	text-align: left;
	max-width: 750px;
	margin: auto;
}
</style>