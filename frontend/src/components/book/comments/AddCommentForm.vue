<template>
    <v-card class="mb-2" variant="outlined">
        <v-card-text>
            <legend class="font-weight-bold">Ajouter un commentaire</legend>
            <v-form v-model="isFormValid" @submit.prevent="post">
                <v-rating v-model="rating" density="compact"></v-rating>
                <v-textarea v-model="text" label="Laissez un commentaire pour les autres utilisateurs..." clearable></v-textarea>
                <menu class="text-right">
                    <v-btn type="submit" :disabled="!isFormValid">Envoyer</v-btn>
                </menu>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref, inject } from 'vue';
import { postComment } from '@/services/BookDataService';

const props = defineProps(["bookId"]);
const emit = defineEmits(["update"]);
const globalEmitter = inject('globalEmitter');


const isFormValid = ref(false);
const loading = ref(false);
const rating = ref(1);
const text = ref("");

function post() {
    loading.value = true;
    const payload = { rating: rating.value, text: text.value };
    postComment(props.bookId, payload)
        .then(book => {
            emit('update', book, "Commentaire publié");
            rating.value = 1;
            text.value = "";
        })
        .catch(err => {
            if (err.message.includes('[401]')) {
                globalEmitter.emit('401');
            } else if (err.message.includes('[403]')) {
                globalEmitter.emit('403');
            } else if (err.message.includes('[404]')) {
                globalEmitter.emit('404');
            } else if (err.message.includes('[400]')) {
                globalEmitter.emit('error', { message: "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer..." });
            } else if (err.message.includes('[500]')) {
                globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
            } else {
                globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
            }
        })
        .finally(() => {
            loading.value = false;
        });
}
</script>