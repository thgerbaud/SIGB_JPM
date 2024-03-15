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

<script setup>
import { ref, computed, inject } from 'vue';
import BooksList from '@/components/library/home/BooksList.vue';
import { getBooks } from '@/services/LibraryDataService';
import { getBookFromIsbn } from '@/services/GoogleBookService';
import flattenCategories from '@/utils/flattenCategories';

const props = defineProps(["library"]);
const globalEmitter = inject('globalEmitter');

const books = ref([]);
const loaded = ref(false);
const sortOptions = [
    { title: "Titre", value: "TIT" },
    { title: "Emplacement", value: "EMP" },
    { title: "Catégorie", value: "CAT" }
];
const sortOption = ref(null);
const searchValue = ref("");
const errorMet = ref(false);
const snackbar = ref(false);

const filteredBooks = computed(() => {
    if (searchValue.value) {
        return books.value.filter(book => book.details.title.toLowerCase().includes(searchValue.value.trim().toLowerCase()));
    } else {
        return books.value;
    }
});

/*searchingList() {
    return books.value.map(book => `${book.details.title} - ${book.details.authors.join(', ')}`);
},*/

const sortedBooks = computed(() => {
    switch (sortOption.value) {
        case "TIT": return sortBooksByTitle();
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
        books.value.forEach(async (book) => {
            try {
                const details = await getBookFromIsbn(book.isbn);
                book.details = details;
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