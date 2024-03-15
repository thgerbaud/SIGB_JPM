<template>
    <v-text-field v-model="libraryName" variant="outlined" :rules="[rules.notEmpty]"
        label="Nom de la bibliothèque" clearable></v-text-field>
    <div class="d-flex justify-space-between">
        <v-btn-tertiary color="error" @click="cancel">Annuler</v-btn-tertiary>
        <v-btn :disabled="!libraryName?.trim()" @click="setName" append-icon="mdi-chevron-right">Suivant</v-btn>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(["prev", "next", "cancel"]);

const libraryName = ref("");
const rules = {
    notEmpty: (value) => (!!value?.trim()) || "Le nom ne doit pas être vide."
};

function setName() {
    const name = libraryName.value?.trim();
    if(name) {
        libraryName.value = name;
        emit('next', name);
    }
}

function cancel() {
    emit('cancel');
}
</script>
