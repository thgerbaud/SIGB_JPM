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
                <v-btn-cancel @click="$emit('cancel')">Annuler</v-btn-cancel>
                <v-btn type="submit" append-icon="mdi-chevron-right" :loading="loading"
                    :disabled="!isFormValid">Chercher</v-btn>
            </menu>

        </v-form>

    </v-responsive>
</template>

<script>
import { getBookFromIsbn } from '@/services/GoogleBookService';
export default {
    data() {
        return {
            isbn: "",
            isFormValid: false,
            loading: false,
            rules: {
                required: (value) => !!value || "Champ obligatoire.",
                isbn_format: (value) => (/^[0-9]+$/.test(value)) || "Numéro invalide (ne doit contenir que des chiffres).",
                isbn_length: (value) => (value.length === 10 || value.length === 13) || "Doit contenir exactement 10 ou 13 chiffres.",
            },
            errorMessage: "",
            errorAlert: false
        }
    },
    methods: {
        handleIsbnInput() {
            this.isbn = this.isbn.replace(/\D/g, '');
        },
        async searchBook() {
            this.loading = true;
            getBookFromIsbn(this.isbn)
                .then(infos => {
                    if (infos === null) {
                        this.errorMessage = `Aucun résultat pour l'ISBN ${this.isbn}.`;
                        this.errorAlert = true;
                    } else {
                        this.$emit('found', infos);
                    }
                })
                .catch(() => {
                    this.errorMessage = "Une erreur s'est produite...";
                    this.errorAlert = true;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    emits: ["cancel", "found"]
}
</script>