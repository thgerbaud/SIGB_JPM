<template>
    <v-snackbar v-model="snackbar" timeout="5000" color="error">Les détails d'un ou plusieurs livres n'ont pas pu être
        chargés.</v-snackbar>

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
import { getBooks } from '@/services/LibraryDataService';
import { getBookFromIsbn } from '@/services/GoogleBookService';
import flattenCategories from '@/utils/flattenCategories';
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
            errorMet: false,
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
                case "TIT": return this.sortBooksByTitle();
                case "EMP": return this.sortBooksByLocations();
                case "CAT": return this.sortBooksByCategories();
                default: return [{
                    title: "Tous",
                    items: this.filteredBooks,
                }]
            }
        },
        flattenedCategories() {
            return flattenCategories(this.library.categories);
        },
    },
    components: {
        BooksList,
    },
    methods: {
        async loadBooks() {
            try {
                const books = await getBooks(this.library.id) ?? [];
                this.books = await Promise.all(
                    books.map(async (book) => {
                        try {
                            const details = await getBookFromIsbn(book.isbn);
                            book.details = details;
                            return book;
                        } catch (err) {
                            //TODO 429 quota dépassé
                            this.snackbar = true;
                            return book;
                        }
                    })
                );
            } catch (err) {
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
            } finally {
                this.loaded = true;
            }
        },
        sortBooksByTitle() {
            // regroupement par première lettre
            const groups = this.filteredBooks.reduce((result, book) => {
                const firstLetter = book.details.title.charAt(0).toUpperCase();
                const existingGroup = result.find(g => g.title === firstLetter);
                if (existingGroup) {
                    existingGroup.items.push(book);
                } else {
                    result.push({ title: firstLetter, items: [book] });
                }
                return result;
            }, []);
            // tri par ordre alphabétique à l'intérieur de chaque groupe
            groups.forEach(groupe => {
                groupe.items.sort((a, b) => a.details.title.toLowerCase().localeCompare(b.details.title.toLowerCase()));
            });
            // tri de la liste principale par ordre alphabétique
            groups.sort((a, b) => a.title.localeCompare(b.title));
            return groups;
        },
        sortBooksByLocations() {
            const dict = {};
            this.library.locations?.forEach(location => {
                dict[location.id] = { title: location.name, items: [] }
            });
            dict.others = { title: "Autres", items: [] };
            console.log(dict);
            this.filteredBooks.forEach(book => {
                book.copies.forEach(copy => {
                    if (copy.location && dict[copy.location]) {
                        if (!dict[copy.location].items.includes(book)) {
                            dict[copy.location].items.push(book)
                        }
                    } else {
                        if (!dict.others.items.includes(book)) {
                            dict.others.items.push(book)
                        }
                    }
                });
            });

            const res = [];
            for (const location in dict) {
                res.push(dict[location]);
            }
            return res;
        },
        sortBooksByCategories() {
            const dict = {};
            this.flattenedCategories.forEach(category => {
                dict[category.id] = { title: category.name, items: [] }
            });
            dict.others = { title: "Non précisée", items: [] };

            this.filteredBooks.map(book => {
                if (book.categories?.length > 0) {
                    book.categories.forEach(category => {
                        if (dict[category]) {
                            dict[category].items.push(book);
                        }
                    });
                } else {
                    dict.others.items.push(book);
                }
            });

            const res = [];
            for (const location in dict) {
                res.push(dict[location]);
            }
            return res;
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