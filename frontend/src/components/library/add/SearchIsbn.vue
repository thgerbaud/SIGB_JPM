<template>
    <v-responsive max-width="800" class="ma-auto">

        <v-form v-model="isFormValid" @submit.prevent="searchBook">
            <h4 class="text-h4">Recherche par ISBN</h4>
            <p class="my-2">
                Entrez le numéro ISBN du livre que vous souhaitez ajouter.
            </p>
            <v-alert type="info" variant="tonal" color="primary" density="compact" class="mb-4"
                text="Si vous souhaitez ajouter un exemplaire d'un livre déjà enregistré dans votre bibliothèque, vous pouvez vous rendre sur la page du livre, et cliquer sur 'ajouter un exemplaire'."></v-alert>
            <v-alert v-model="errorAlert" type="error" variant="tonal" density="compact" class="mb-4"
                :text="errorMessage"></v-alert>
            <v-text-field label="N° ISBN" variant="outlined" v-model="isbn" clearable prepend-inner-icon="mdi-magnify"
                hint="Code à 10 ou 13 chiffres, souvent situé en quatrième de couverture."
                :rules="[rules.required, rules.isbn_format, rules.isbn_length]" persistent-hint @input="handleIsbnInput"
                maxlength="13"></v-text-field>


            <menu id="form-menu">
                <v-btn-cancel @click="cancel">Annuler</v-btn-cancel>
                <v-btn type="submit" append-icon="mdi-chevron-right" :loading="loading"
                    :disabled="!isFormValid">Chercher</v-btn>
            </menu>

        </v-form>

    </v-responsive>
</template>

<script setup>
import { ref } from 'vue';
import { getBookFromIsbn } from '@/services/GoogleBookService';

const emit = defineEmits(["cancel", "found"]);

const rules = {
    required: (value) => !!value || "Champ obligatoire.",
    isbn_format: (value) => (/^[0-9]+$/.test(value)) || "Numéro invalide (ne doit contenir que des chiffres).",
    isbn_length: (value) => (value.length === 10 || value.length === 13) || "Doit contenir exactement 10 ou 13 chiffres.",
};

const isbn = ref("");
const isFormValid = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const errorAlert = ref(false);

function handleIsbnInput() {
    isbn.value = isbn.value.replace(/\D/g, '');
}

function cancel() {
    emit('cancel');
}

async function searchBook() {
    loading.value = true;
    try {
        const infos = await getBookFromIsbn(isbn.value);
        if (infos === null) {
            errorMessage.value = `Aucun résultat pour l'ISBN ${isbn.value}.`;
            errorAlert.value = true;
        } else {
            emit('found', infos);
        }
    } catch (error) {
        errorMessage.value = "Une erreur s'est produite...";
        errorAlert.value = true;
    } finally {
        loading.value = false;
    }
}
</script>
