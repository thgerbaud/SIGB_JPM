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

        <menu class="form-menu flex-column flex-md-row">
            <v-btn-secondary prepend-icon="mdi-chevron-left" @click="previous">Revenir</v-btn-secondary>
            <v-btn-cancel @click="cancel">Annuler</v-btn-cancel>
            <v-btn append-icon="mdi-chevron-right" @click="next">Continuer</v-btn>
        </menu>
    </v-responsive>
</template>

<script setup>
defineProps(["book"]);
const emit = defineEmits(["previous", "next", "cancel"]);

function previous() {
    emit('previous');
}

function cancel() {
    emit('cancel');
}

function next() {
    emit('next');
}
</script>
