<template>
    <v-responsive max-width="800" class="ma-auto">
        <h4 class="text-h6 text-sm-h5 text-md-h4">Résultat pour l'ISBN {{ book.isbn }} :</h4>
        <div class="d-flex flex-column flex-md-row my-4 align-center align-md-start">
            <v-img :src="book.image" class="mr-md-4" width="150"></v-img>
            <div>
                <h4 class="text-h5 text-md-h4">{{ book.title }}</h4>
                <h5 class="text-h6 text-md-h5">{{ book.authors?.join(', ') }}</h5>
                <p class="text-justify my-4">{{ book.description }}</p>
            </div>
        </div>
        <v-alert v-if="existingBook" type="info" variant="tonal" color="primary" density="compact" class="mb-4"
            text="Ce livre est déjà présent dans votre bibliothèque. Vous allez être redirigé vers la page du livre."></v-alert>
        <menu class="form-menu flex-column flex-md-row">
            <v-btn-secondary prepend-icon="mdi-chevron-left" @click="previous">Revenir</v-btn-secondary>
            <v-btn-cancel @click="cancel">Annuler</v-btn-cancel>
            <v-btn append-icon="mdi-chevron-right" @click="next">Continuer</v-btn>
        </menu>
    </v-responsive>
</template>

<script setup>
import { computed } from 'vue';
import { useLibraryStore } from '@/store/library';
import router from '@/router';

const props = defineProps(["book", "libraryId"]);
const emit = defineEmits(["previous", "next", "cancel"]);
const libraryStore = useLibraryStore();

const existingBook = computed(() => {
    return libraryStore.books.find(item => item.isbn === props.book.isbn);
});

function previous() {
    emit('previous');
}

function cancel() {
    emit('cancel');
}

function next() {
    if( existingBook.value ) {
        router.push(`/${props.libraryId}/books/${existingBook.value.id}`)
    } else {
        emit('next');
    }
}
</script>
