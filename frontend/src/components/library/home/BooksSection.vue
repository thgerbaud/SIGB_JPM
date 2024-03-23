<template>
    <v-snackbar v-model="snackbar" timeout="5000" color="error">Les détails d'un ou plusieurs livres n'ont pas pu être
        chargés.</v-snackbar>

    <v-toolbar class="bg-transparent my-8 my-md-0">
        <div class="d-flex flex-column flex-md-row w-100 justify-space-between pt-2">
            <v-sheet min-width="50%" class="mb-4">
                <v-combobox clearable label="Chercher un livre" :items="searchingList" prepend-inner-icon="mdi-magnify"
                    variant="outlined" density="compact" v-model="searchValue" hide-details></v-combobox>
            </v-sheet>
            <v-sheet min-width="25%">
                <v-select clearable label="Trier par" :items="sortOptions" v-model="sortOption" hide-details
                    prepend-inner-icon="mdi-sort" density="compact" :min-width="250"></v-select>
            </v-sheet>
        </div>
    </v-toolbar>

    <div v-if="!loaded" class="d-flex flex-wrap">
        <v-skeleton-loader type="card" v-for="n in 5" :key="n" class="mx-2" width="200"></v-skeleton-loader>
    </div>
    <div v-else-if="errorMet" class="font-italic text-disabled ma-4 text-center">
        <v-icon icon="mdi-server-off" size="x-large" class="mb-4"></v-icon>
        <p>
            Impossible de récupérer vos livres.
            Essayez de rafaîchir la page, si l'erreur persiste veuillez réessayer plus tard.
        </p>
    </div>
    <p v-else-if="sortedBooks.length === 0" class="my-4 font-italic text-disabled">Aucun livre</p>
    <BooksList v-else v-for="(list, index) in sortedBooks" :key="index" :books="list" :libraryId="library.id" />
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { useLibraryStore } from '@/store/library';
import BooksList from '@/components/library/home/BooksList.vue';
import { getBooks } from '@/services/LibraryDataService';
import { getBookFromIsbn } from '@/services/GoogleBookService';
import flattenCategories from '@/utils/flattenCategories';

const props = defineProps(["library"]);
const globalEmitter = inject('globalEmitter');
const libraryStore = useLibraryStore();

const books = ref([]);
const loaded = ref(false);
const sortOptions = [
    { title: "Titre", value: "TIT" },
    { title: "Auteur", value: "AUT" },
    { title: "Emplacement", value: "EMP" },
    { title: "Catégorie", value: "CAT" }
];
const sortOption = ref(null);
const searchValue = ref(null);
const errorMet = ref(false);
const snackbar = ref(false);

const filteredBooks = computed(() => {
    if (searchValue.value) {
        return books.value.filter(book => book.searchLabel?.toLowerCase().includes(searchValue.value.trim().toLowerCase()));
    } else {
        return books.value;
    }
});

const searchingList = computed(() => {
    return books.value.map(book => book.searchLabel);
});

const sortedBooks = computed(() => {
    switch (sortOption.value) {
        case "TIT": return sortBooksByTitle();
        case "AUT": return sortBooksByAuthor();
        case "EMP": return sortBooksByLocations();
        case "CAT": return sortBooksByCategories();
        default: return [{
            title: "Tous",
            items: filteredBooks.value,
        }]
    }
});

const flattenedCategories = computed(() => {
    return flattenCategories(props.library.categories);
});

async function loadBooks() {
    try {
        books.value = await getBooks(props.library.id) ?? [];
        libraryStore.setBooks(books.value);
        books.value.forEach(async (book) => {
            try {
                const details = await getBookFromIsbn(book.isbn);
                book.details = details;
                book.searchLabel = (details) ? `${book.details?.title} - ${book.details?.authors.join(', ')}` : undefined;
            } catch (err) {
                //TODO 429 quota dépassé
                snackbar.value = true;
            }
        });
    } catch (err) {
        if (err.message.includes(401)) {
            globalEmitter.emit('401');
        } else if (err.message.includes(403)) {
            globalEmitter.emit('403');
        } else if (err.message.includes(404)) {
            globalEmitter.emit('404');
        } else if (err.message.includes(500)) {
            globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
        } else {
            globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
        }
        errorMet.value = true;
    } finally {
        loaded.value = true;
    }
}

function sortBooksByTitle() {
    // regroupement par première lettre
    const groups = filteredBooks.value.reduce((result, book) => {
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
}

function sortBooksByAuthor() {
    const dict = {};
    const unknown = { title: "Inconnu", items: [] };
    filteredBooks.value.forEach(book => {
        if (book.details && book.details?.authors?.length > 0) {
            book.details.authors.forEach(author => {
                if (dict[author]) {
                    dict[author].items.push(book);
                } else {
                    dict[author] = { title: author, items: [book] };
                }
            });
        } else {
            unknown.items.push(book);
        }
    });

    const res = [];
    for (const author in dict) {
        res.push(dict[author]);
    }
    res.sort((a, b) => a.title.localeCompare(b.title));
    if (unknown.items.length > 0) {
        res.push(unknown);
    }
    return res;
}

function sortBooksByLocations() {
    const dict = {};
    props.library.locations?.forEach(location => {
        dict[location.id] = { title: location.name, items: [] }
    });
    dict.others = { title: "Autres", items: [] };
    filteredBooks.value.forEach(book => {
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
}

function sortBooksByCategories() {
    const dict = {};
    flattenedCategories.value.forEach(category => {
        dict[category.id] = { title: category.name, items: [] }
    });
    dict.others = { title: "Non précisée", items: [] };

    filteredBooks.value.map(book => {
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
}

loadBooks();
</script>