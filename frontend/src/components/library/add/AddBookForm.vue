<template>
    <AddSuccessDialog v-model="addSuccessDialog" :id="createdBook?.id" :title="book?.title"
        :nbCopies="createdBook?.copies.length" @addAnother="previous" @seeBook="goToBook" @goHome="cancel" />

    <ConfirmDialog title="Annuler l'ajout du livre"
        text="Êtes-vous sûr de vouloir quitter la page ? Toutes les données entrées seront perdues."
        okText="Continuer l'ajout" cancelText="Quitter" v-model="confirmCancelDialog" @ok="confirmCancelDialog = false"
        @cancel="cancel" />

    <v-responsive max-width="800" class="ma-auto">
        <h4 class="text-h5 text-md-h4">{{ book.title }}</h4>
        <h5 class="text-h6 text-md-h5">{{ book.authors?.join(', ') }}</h5>
        <v-form class="my-4" v-model="isFormValid" ref="addForm" @submit.prevent="saveBook">

            <v-select label="Catégories" multiple clearable hint="(optionnel)" persistent-hint
                no-data-text="Aucune catégorie" :items="categoriesSelectItems" v-model="categories"
                :density="(smAndDown) ? 'compact' : 'default'">
                <template #item="data">
                    <v-divider v-if="data.props.depth === 0"></v-divider>
                    <v-list-item v-bind="data.props">
                        <template v-slot:prepend="{ isActive }">
                            <v-list-item-action start :class="`ml-${data.props.depth * 8}`">
                                <v-checkbox-btn :model-value="isActive"
                                    @change="isActive ? addParents(data.props.parents) : removeChildrens(data.item.value)"></v-checkbox-btn>
                            </v-list-item-action>
                        </template>
                    </v-list-item>
                </template>
            </v-select>

            <p>
                Pour chaque exemplaire du livre, indiquez un code unique pour le référencer.<br>
                Vous pouvez également indiquer son emplacement pour aider vos usagers à le trouver.
            </p>

            <v-container class="px-0">
                <v-row v-for="(copy, index) in copies" :key="copy" :dense="smAndDown">
                    <v-col class="pb-0">
                        <v-text-field label="Code" v-model="copy.code" clearable
                            hint="Choisissez un code unique pour identifier votre exemplaire"
                            :rules="[rules.required, rules.code, rules.duplicates(index)]" persistent-hint maxlength="10"
                            @input="handleCodeInput(index)" :density="(smAndDown) ? 'compact' : 'default'"></v-text-field>
                    </v-col>
                    <v-col class="pb-0">
                        <v-select label="Emplacement"
                            :items="library.locations?.map(({ name, id }) => ({ title: name, value: id }))"
                            v-model="copy.location" clearable hint="(optionnel)" persistent-hint
                            :density="(smAndDown) ? 'compact' : 'default'" no-data-text="Aucun emplacement"></v-select>
                    </v-col>
                    <v-col cols="1" class="pb-0" v-if="copies.length > 1">
                        <v-btn variant="plain" icon="mdi-close-circle" color="error" @click="removeCopy(index)"></v-btn>
                    </v-col>
                </v-row>
                <v-btn variant="text" prepend-icon="mdi-plus" @click="addCopy">ajouter un exemplaire</v-btn>
            </v-container>

            <menu class="form-menu flex-column flex-md-row">
                <v-btn-secondary prepend-icon="mdi-chevron-left" @click="previous">Revenir</v-btn-secondary>
                <v-btn-cancel @click="confirmCancelDialog = true">Annuler</v-btn-cancel>
                <v-btn type="submit" :loading="loading" prepend-icon="mdi-check" :disabled="!isFormValid">Terminer</v-btn>
            </menu>
        </v-form>
    </v-responsive>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import AddSuccessDialog from '@/components/library/add/AddSuccessDialog';
import ConfirmDialog from '@/components/utils/dialogs/ConfirmDialog';
import { create } from '@/services/BookDataService';

const props = defineProps(["library", "book"]);
const emit = defineEmits(["previous", "cancel"]);
const globalEmitter = inject('globalEmitter');
const router = useRouter();
const { smAndDown } = useDisplay();

const categories = ref([]);
const copies = ref([{ code: "", location: null }]);
const isFormValid = ref(false);
const loading = ref(false);
const createdBook = ref(null);
const addSuccessDialog = ref(false);
const confirmCancelDialog = ref(false);

const rules = {
    required: (value) => !!value || "Champ obligatoire.",
    code: (value) => (/^[a-zA-Z0-9]+$/.test(value)) || "Ne doit contenir que des chiffres et des lettres.",
    duplicates: (index) => (value) => (isUnique(value, index)) || "Le code doit être unique."
};

const categoriesSelectItems = computed(() => { //TODO reuse this editBook
    const flattenCategories = (categories, depth, parents) => { //TODO compare with utils
        let result = [];

        categories.forEach(category => {
            result.push({ value: category.id, title: category.name, props: { depth, parents } });

            if (category.subcategories) {
                let parentsCopy = [...parents];
                parentsCopy.push(category.id);
                result = result.concat(flattenCategories(category.subcategories, depth + 1, parentsCopy));
            }
        });

        return result;
    }
    return flattenCategories(props.library.categories, 0, []);
});

function previous() {
    emit('previous');
}

function cancel() {
    emit('cancel');
}

function handleCodeInput(i) {
    copies.value[i].code = copies.value[i].code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function addCopy() {
    copies.value.push({ code: "", location: null });
}

function removeCopy(i) {
    if (copies.value.length > 1) {
        copies.value.splice(i, 1);
    }
}

function isUnique(v, i) {
    const value = v?.trim().toUpperCase();
    return copies.value.every((copy, index) => {
        return index === i || !copy.code || copy.code?.trim().toUpperCase() !== value;
    });
}

function addParents(parents) {
    parents.forEach(id => {
        if (!categories.value.includes(id)) {
            categories.value.push(id);
        }
    });
}

function removeChildrens(id) {
    const childrens = categoriesSelectItems.value
        .filter(category => category.props.parents?.includes(id))
        .map(category => category.value);
    categories.value = categories.value.filter(id => !childrens.includes(id));
}

function saveBook() {
    loading.value = true;
    const payload = {
        isbn: props.book.isbn,
        library: props.library.id,
        categories: categories.value,
        copies: copies.value
    }
    create(payload)
        .then(response => {
            createdBook.value = response;
            addSuccessDialog.value = true;
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

function goToBook() {
    router.push(`/${props.library.id}/books/${createdBook.value.id}`);
}
</script>