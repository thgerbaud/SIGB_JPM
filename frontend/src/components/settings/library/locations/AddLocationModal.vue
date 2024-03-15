<template>
    <v-dialog width="500" persistent>
        <v-card title="Ajouter un emplacement">
            <template v-slot:prepend>
                <v-icon icon="mdi-map-marker-plus" color="primary"></v-icon>
            </template>
            <v-card-text>
                <v-form v-model="isFormValid">
                    <legend>Entrez le nom du nouvel emplacement :</legend>
                    <v-text-field label="Nom" class="mt-4" v-model="name" variant="outlined" clearable
                        :rules="[rules.required, rules.duplicate]"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" class="flex-grow-1" @click="cancel">Annuler</v-btn>
                <v-btn class="flex-grow-1" @click="add" :disabled="!isFormValid" :loading="loading">Ajouter</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, inject } from 'vue';
import { addLocation } from '@/services/LibraryDataService';

const props = defineProps(["library"]);
const emit = defineEmits(["cancel", "update"]);
const globalEmitter = inject('globalEmitter');

const name = ref("");
const isFormValid = ref(false);
const loading = ref(false);
const rules = {
    required: (value) => !!value?.trim() || "Le nom ne doit pas être vide.",
    duplicate: (value) => !props.library.locations?.find(location => location.name === value?.trim()) || "Un emplacement avec ce nom existe déjà.",
}

function cancel() {
    name.value = "";
    emit('cancel');
}

function add() {
    loading.value = true;
    addLocation(props.library.id, name.value)
        .then(library => {
            emit('update', library);
            name.value = "";
            loading.value = false;
        })
        .catch(err => {
            loading.value = false;
            if (err.message.includes('[401]')) {
                globalEmitter.emit('401');
            } else if (err.message.includes('[403]')) {
                globalEmitter.emit('403');
            } else if (err.message.includes('[404]')) {
                globalEmitter.emit('404');
            } else if (err.message.includes('[400]')) {
                globalEmitter.emit('error', { message: "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer..." });
            } else if (err.message.includes('[409]')) {
                globalEmitter.emit('error', { message: "Il semblerait que vous ayez déjà un emplacement avec ce nom." });
            } else if (err.message.includes('[500]')) {
                globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
            } else {
                globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
            }
        });
}
</script>