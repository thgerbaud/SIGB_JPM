<template>
    <v-responsive max-width="800" class="ma-auto">
        <h4 class="text-h4">Résultat pour l'ISBN {{ book.isbn }} :</h4>
        <div class="d-flex my-4 align-start">
            <v-img :src="book.image" width="150" max-width="150" class="mr-4"></v-img>
            <div>
                <h4 class="text-h4">{{ book.title }}</h4>
                <h5 class="text-h5">{{ book.authors?.join(', ') }}</h5>
                <p class="text-justify my-4">{{ book.description }}</p>
            </div>
        </div>

        <menu id="form-menu">
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
