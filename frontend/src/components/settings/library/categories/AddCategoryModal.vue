<template>
    <v-dialog width="500" persistent>
        <v-card :title="title">
            <template v-slot:prepend>
                <v-icon icon="mdi-tag-plus" color="primary"></v-icon>
            </template>
            <v-card-text>
                <v-form v-model="isFormValid">
                    <legend>Entrez le nom de la nouvelle catégorie :</legend>
                    <v-text-field label="Nom" class="mt-4" v-model="name" clearable
                        :rules="[rules.required, rules.duplicate]" autofocus></v-text-field>
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
import { ref, inject, computed } from 'vue';
import { addCategory } from '@/services/LibraryDataService';
import flattenCategories from '@/utils/flattenCategories';

const props = defineProps(["library", "parent"]);
const emit = defineEmits(["cancel", "update"]);
const globalEmitter = inject('globalEmitter');

const name = ref("");
const isFormValid = ref(false);
const loading = ref(false);
const rules = {
    required: (value) => !!value?.trim() || "Le nom ne doit pas être vide.",
    duplicate: (value) => !flattenedCategories.value.find(category => category.name === value?.trim()) || "Une catégorie avec ce nom existe déjà.",
}

const title = computed(() => {
    return (props.parent) ? `Ajouter une sous-catégorie à «${props.parent.name}»` : "Ajouter une catégorie principale";
});

const flattenedCategories = computed(() => {
    return flattenCategories(props.library.categories);
})

function cancel() {
    name.value = "";
    emit('cancel');
}

function add() {
    loading.value = true;
    addCategory(props.library.id, name.value, props.parent?.id)
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
                globalEmitter.emit('error', { message: "Il semblerait que vous ayez déjà une catégorie avec ce nom." });
            } else if (err.message.includes('[500]')) {
                globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
            } else {
                globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
            }
        });
}
</script>