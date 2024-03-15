<template>
    <v-dialog persistent width="800">
        <v-card title="Ajouter un exemplaire">
            <template v-slot:prepend>
                <v-icon icon="mdi-book-plus-outline" color="primary"></v-icon>
            </template>
            <v-card-item>
                <p class="mb-2">
                    Indiquez un code unique pour référencer votre nouvel exemplaire.<br>
                    Vous pouvez également indiquer son emplacement pour aider vos usagers à le trouver.
                </p>
                <v-form v-model="isFormValid" @submit.prevent>
                    <v-text-field label="Code" variant="outlined" v-model="code" clearable
                        hint="Choisissez un code unique pour identifier votre exemplaire"
                        :rules="[rules.required, rules.code]" persistent-hint maxlength="10"
                        @input="handleCodeInput(index)"></v-text-field>
                    <v-select label="Emplacement" variant="outlined" :items="locationItems" v-model="location" clearable
                        hint="(optionnel)" persistent-hint></v-select>
                </v-form>
            </v-card-item>
            <v-card-actions>
                <v-btn-cancel class="flex-grow-1" @click="emit('cancel')">Annuler</v-btn-cancel>
                <v-btn variant="flat" class="flex-grow-1" :loading="loading" @click="saveCopy"
                    :disabled="!isFormValid">Ajouter</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, inject } from 'vue';
import { addCopy } from '@/services/BookDataService';
import { computed } from 'vue';

const props = defineProps(["library", "bookId"]);
const emit = defineEmits(["update", "cancel"]);
const globalEmitter = inject('globalEmitter');

const code = ref("");
const location = ref(null);
const loading = ref(false);
const isFormValid = ref(false);
const rules = {
    required: (value) => !!value || "Champ obligatoire.",
    code: (value) => (/^[a-zA-Z0-9]+$/.test(value)) || "Ne doit contenir que des chiffres et des lettres."
    //TODO duplicate
}

const locationItems = computed(() => {
    let items = props.library.locations.map(({ name, id }) => ({ title: name, value: id }));
    items.unshift({ title: "Non précisé", value: null });
    return items;
});

function handleCodeInput() {
    code.value = code.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function saveCopy() {
    loading.value = true;
    const payload = { code: code.value, location: location.value };
    addCopy(props.bookId, payload)
        .then(book => {
            emit('update', book);
        })
        .catch(err => {
            if (err.message.includes('[401]')) {
                globalEmitter.emit('401');
            } else if (err.message.includes('[403]')) {
                globalEmitter.emit('403');
            } else if (err.message.includes('[404]')) {
                globalEmitter.emit('404');
            } else if (err.message.includes('[409]')) {
                globalEmitter.emit('error', { message: "Il semblerait que vous ayez déjà un livre identifié avec ce code. Veuillez choisir un code unique pour votre exemplaire et réessayez..." });
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