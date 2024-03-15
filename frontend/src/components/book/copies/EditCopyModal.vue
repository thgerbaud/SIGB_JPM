<template>
    <v-dialog persistent width="800">
        <v-card prepend-icon="mdi-book-edit-outline" title="Modifier l'exemplaire">
            <v-card-item>
                <p class="mb-4">Modifiez le code et/ou l'emplacement de votre exemplaire.</p>
                <v-form v-model="isFormValid" @submit.prevent>
                    <v-text-field label="Code" variant="outlined" v-model="newCode" clearable
                        hint="Choisissez un code unique pour identifier votre exemplaire"
                        :rules="[rules.required, rules.code]" persistent-hint maxlength="10"
                        @input="handleCodeInput(index)"></v-text-field>
                    <v-select label="Emplacement" variant="outlined" :items="locationItems" v-model="newLocation" clearable
                        hint="(optionnel)" persistent-hint></v-select>
                </v-form>
            </v-card-item>
            <v-card-actions>
                <v-btn-secondary @click="cancel" color="error" class="flex-grow-1">Annuler</v-btn-secondary>
                <v-btn variant="flat" class="flex-grow-1" :disabled="!isFormValid || !isDifferent" :loading="loading"
                    @click="save">Enregistrer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { updateCopy } from '@/services/BookDataService';
import { ref, watch, computed, inject, toRef } from 'vue';

const props = defineProps(["copy", "library", "bookId"]);
const emit = defineEmits(["cancel", "update"]);
const globalEmitter = inject('globalEmitter');

const copy = toRef(props.copy);
const newCode = ref(props.copy?.code);
const newLocation = ref(props.copy?.location);
const loading = ref(false);
const isFormValid = ref(false);
const rules = {
    required: (value) => !!value || "Champ obligatoire.",
    code: (value) => (/^[a-zA-Z0-9]+$/.test(value)) || "Ne doit contenir que des chiffres et des lettres."
}

const locationItems = computed(() => {
    let items = props.library.locations.map(({ name, id }) => ({ title: name, value: id }));
    items.unshift({ title: "Non précisé", value: null });
    return items;
});

const isDifferent = computed(() => {
    return (newCode.value !== props.copy?.code) || (newLocation.value !== props.copy?.location);
});

watch(copy, () => {
    reset();
});

function handleCodeInput() {
    newCode.value = newCode.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function reset() {
    newCode.value = props.copy?.code;
    newLocation.value = props.copy?.location;
}

function cancel() {
    reset();
    emit('cancel');
}

const save = () => {
    loading.value = true;
    const payload = {};
    if (newCode.value !== props.copy?.code) {
        payload.code = newCode.value;
    }
    if (newLocation.value !== props.copy?.location) {
        payload.location = newLocation.value;
    }
    updateCopy(props.bookId, props.copy.id, payload)
        .then(updatedBook => {
            emit('update', updatedBook);
        })
        .catch(err => {
            if (err.message.includes('[401]')) {
                globalEmitter.emit('401');
            } else if (err.message.includes('[403]')) {
                globalEmitter.emit('403');
            } else if (err.message.includes('[404]')) {
                globalEmitter.emit('404');
            } else if (err.message.includes('[400]')) {
                const errorMessage = err.message.includes("Duplicate") ? "Il semblerait que vous ayez déjà un livre identifié avec ce code. Veuillez choisir un code unique pour votre exemplaire et réessayez..." : "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer...";
                globalEmitter.emit('error', { message: errorMessage });
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