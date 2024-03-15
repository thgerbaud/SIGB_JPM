<template>
    <v-card v-if="book.details" variant="flat" class="pa-2" width="200" :to="`/${libraryId}/books/${book.id}`">
        <v-img height="200" :src="book.details.image"></v-img>
        <v-card-text>
            <p class="font-weight-bold">{{ book.details.title }}</p>
            <legend>{{ book.details.authors?.join(', ') }}</legend>
        </v-card-text>
    </v-card>
    <v-card v-else variant="flat" class="pa-2" width="200">
        <v-container class="text-center" min-height="200">
            <v-icon icon="mdi-book-alert" size="x-large"></v-icon>
        </v-container>
        <v-card-text>
            <legend class="font-italic">Impossible de récupérer les données.</legend>
        </v-card-text>
    </v-card>
</template>

<script setup>
defineProps(["book", "libraryId"]);
</script>