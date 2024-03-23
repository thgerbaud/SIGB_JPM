<template>
    <v-dialog width="500" persistent>
        <v-card title="Bibliothèque supprimée">
            <template v-slot:prepend>
                <v-icon icon="mdi-check" color="primary"></v-icon>
            </template>
            <v-card-text>
                <p>La bibliothèque a bien été supprimée, vous allez être redirigé(e) vers la liste de vos bibliothèques.</p>
            </v-card-text>
            <v-card-actions>
                <v-btn block @click="router.push('/')">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>