<template>
    <ExpiredSessionDialog v-model="expiredSessionDialog" />

    <ErrorDialog v-model="errorDialog" @close="errorDialog = false" :message="errorMessage" />

    <AccessDeniedDialog v-model="accessDeniedDialog" @ok="exitLibrary" />

    <NotFoundDialog v-model="notFoundDialog" @ok="exitLibrary" />

    <v-snackbar v-model="snackbar" timeout="5000" color="error">Les détails d'un ou plusieurs livres n'ont pas pu être chargés.</v-snackbar>

    <v-toolbar class="bg-transparent overflow-visible">
        <v-responsive :max-width="500" class="overflow-visible">
            <v-text-field clearable label="Chercher un livre" hide-details prepend-inner-icon="mdi-magnify"
                variant="outlined" density="compact" v-model="searchValue"></v-text-field>
            <!-- problème de hauteur avec le v-combobox
            <v-combobox clearable label="Chercher un livre" :items="searchingList" prepend-inner-icon="mdi-magnify"
                variant="outlined" density="compact"></v-combobox>
            -->
        </v-responsive>
        <v-spacer></v-spacer>
        <v-responsive class="overflow-visible" :max-width="250">
            <v-select clearable label="Trier par" :items="sortOptions" variant="outlined" v-model="sortOption" hide-details
                prepend-inner-icon="mdi-sort" density="compact"></v-select>
        </v-responsive>
    </v-toolbar>

    <div v-if="!loaded" class="d-flex flex-wrap">
        <v-skeleton-loader type="card" v-for="n in 5" :key="n" class="mx-2" width="200"></v-skeleton-loader>
    </div>
    <div v-else-if="errorMet" class="empty-section ma-4 text-center">
        <v-icon icon="mdi-server-off" size="x-large" class="mb-4"></v-icon>
        <p>
            Impossible de récupérer vos livres.
            Essayez de rafaîchir la page, si l'erreur persiste veuillez réessayer plus tard.
        </p>
    </div>
    <BooksList v-else v-for="(list, index) in sortedBooks" :key="index" :books="list" :libraryId="library.id" />
</template>

<script>
import BooksList from '@/components/library/home/BooksList.vue';
import ExpiredSessionDialog from '@/components/utils/ExpiredSessionDialog.vue';
import ErrorDialog from '@/components/utils/ErrorDialog';
import NotFoundDialog from '@/components/utils/NotFoundDialog.vue';
import AccessDeniedDialog from '@/components/utils/AccessDeniedDialog.vue';
import LibraryDataService from '@/services/LibraryDataService';
import { getBookFromIsbn } from '@/services/GoogleBookService';
export default {
    props: ["library"],
    data() {
        return {
            books: [],
            loaded: false,
            sortOptions: [
                { title: "Titre", value: "TIT" },
                { title: "Emplacement", value: "EMP" },
                { title: "Catégorie", value: "CAT" }
            ],
            sortOption: null,
            searchValue: "",
            errorMessage: "Oups! Une erreur s'est produite...",
            errorMet: false,
            errorDialog: false,
            expiredSessionDialog: false,
            accessDeniedDialog: false,
            notFoundDialog: false,
            snackbar: false
        }
    },
    computed: {
        filteredBooks() {
            if (this.searchValue) {
                return this.books.filter(book => book.details.title.toLowerCase().includes(this.searchValue.trim().toLowerCase()));
            } else {
                return this.books;
            }
        },
        /*searchingList() {
            return this.books.map(book => `${book.details.title} - ${book.details.authors.join(', ')}`);
        },*/
        sortedBooks() {
            switch (this.sortOption) {
                case "TIT": return [{
                    title: "Tous",
                    items: this.filteredBooks.toSorted(this.alphabeticalCompareFn),
                }];
                case "EMP": return this.sortBooksByLocations();
                case "CAT": return this.sortBooksByCategories();
                default: return [{
                    title: "Tous",
                    items: this.filteredBooks,
                }]
            }
        },
    },
    components: {
        BooksList,
        ErrorDialog,
        ExpiredSessionDialog,
        NotFoundDialog,
        AccessDeniedDialog
    },
    methods: {
        async loadBooks() {
            try {
                const books = await LibraryDataService.getBooks(this.library.id) ?? [];
                this.books = await Promise.all(
                    books.map(async (book) => {
                        try {
                            const details = await getBookFromIsbn(book.isbn);
                            book.details = details;
                            return book;
                        } catch (err) {
                            //429 quota dépassé
                            console.error(err);
                            this.snackbar = true;
                            return book;
                        }
                    })
                );
            } catch (err) {
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
                this.errorMet = true;
            } finally {
                this.loaded = true;
            }
        },
        alphabeticalCompareFn(book1, book2) {
            const title1 = book1.details.title.toLowerCase();
            const title2 = book2.details.title.toLowerCase();
            if (title1 < title2) {
                return -1;
            } else if (title1 > title2) {
                return 1;
            } else {
                return 0;
            }
        },
        sortBooksByLocations() {
            let res = this.library.locations.map(location => ({ title: location, items: [] }));
            let others = { title: "Autres", items: [] };
            this.filteredBooks.map(book => {
                const locationIndex = book.location ?? -1;
                if (locationIndex > this.library.locations.length || locationIndex < 0) {
                    others.items.push(book);
                } else {
                    res[locationIndex].items.push(book);
                }
            });
            res.push(others);
            return res;
        },
        sortBooksByCategories() {
            let res = this.library.categories.map(category => ((category) ? { title: category, items: [] } : null));
            let others = { title: "Autres", items: [] };
            this.filteredBooks.map(book => {
                const categoryIndex = book.category ?? -1;
                if (categoryIndex > this.library.categories.length || categoryIndex < 0 || res[categoryIndex] === null) {
                    others.items.push(book);
                } else {
                    res[categoryIndex].items.push(book);
                }
            });
            res.push(others);
            return res.filter(e => e !== null);
        },
        exitLibrary() {
            this.$store.commit('exitLibrary');
            this.$router.push('/home/libraries');
        }
    },
    async created() {
        await this.loadBooks();
    }
}
</script>