<template>
    <AddSuccessDialog v-model="addSuccessDialog" :id="createdBook?.id" :title="book?.title"
        :nbCopies="createdBook?.copies.length" @addAnother="$emit('previous')"
        @seeBook="$router.push(`/${library.id}/books/${createdBook.id}`)" @goHome="$emit('cancel')" />

    <ConfirmDialog title="Annuler l'ajout du livre"
        text="Êtes-vous sûr de vouloir quitter la page ? Toutes les données entrées seront perdues."
        okText="Continuer l'ajout" cancelText="Quitter" v-model="confirmCancelDialog" @ok="confirmCancelDialog = false"
        @cancel="$emit('cancel')" />

    <v-responsive max-width="800" class="ma-auto">
        <h4 class="text-h4">{{ book.title }}</h4>
        <h5 class="text-h5">{{ book.authors?.join(', ') }}</h5>
        <v-form class="my-4" v-model="isFormValid" ref="addForm" @submit.prevent="saveBook">
            <v-select label="Catégorie" variant="outlined"
                :items="library.categories?.map((title, value) => ({ title, value }))" v-model="category" clearable
                hint="(optionnel)" persistent-hint></v-select>

            <p>
                Pour chaque exemplaire du livre, indiquez un code unique pour le référencer.<br>
                Vous pouvez également indiquer son emplacement pour aider vos usagers à le trouver.
            </p>

            <v-container class="px-0">
                <v-row v-for="(copy, index) in copies" :key="copy">
                    <v-col class="pb-0">
                        <v-text-field label="Code" variant="outlined" v-model="copy.code" clearable
                            hint="Choisissez un code unique pour identifier votre exemplaire"
                            :rules="[rules.required, rules.code, rules.duplicates(index)]" persistent-hint maxlength="10"
                            @input="handleCodeInput(index)"></v-text-field>
                    </v-col>
                    <v-col class="pb-0">
                        <v-select label="Emplacement" variant="outlined"
                            :items="library.locations?.map((title, value) => ({ title, value }))" v-model="copy.location"
                            clearable hint="(optionnel)" persistent-hint></v-select>
                    </v-col>
                    <v-col cols="1" class="pb-0" v-if="copies.length > 1">
                        <v-btn variant="plain" icon="mdi-close-circle" color="error" @click="removeCopy(index)"></v-btn>
                    </v-col>
                </v-row>
                <v-btn variant="text" prepend-icon="mdi-plus" @click="addCopy">ajouter un exemplaire</v-btn>
            </v-container>

            <menu id="form-menu">
                <v-btn-secondary prepend-icon="mdi-chevron-left" @click="$emit('previous')">Revenir</v-btn-secondary>
                <v-btn-cancel @click="confirmCancelDialog = true">Annuler</v-btn-cancel>
                <v-btn type="submit" :loading="loading" prepend-icon="mdi-check" :disabled="!isFormValid">Terminer</v-btn>
            </menu>
        </v-form>
    </v-responsive>
</template>

<script>
import AddSuccessDialog from '@/components/library/add/AddSuccessDialog';
import ConfirmDialog from '@/components/utils/dialogs/ConfirmDialog';
import BookDataService from '@/services/BookDataService';
export default {
    props: ["library", "book"],
    data() {
        return {
            category: null,
            copies: [{ code: "", location: null }],
            rules: {
                required: (value) => !!value || "Champ obligatoire.",
                code: (value) => (/^[a-zA-Z0-9]+$/.test(value)) || "Ne doit contenir que des chiffres et des lettres.",
                duplicates: (index) => (value) => (this.isUnique(value, index)) || "Le code doit être unique."
            },
            isFormValid: false,
            loading: false,
            createdBook: null,
            addSuccessDialog: false,
            confirmCancelDialog: false
        }
    },
    watch: {
        copies: {
            handler() {
                this.$refs.addForm.validate();
            },
            deep: true
        }
    },
    components: {
        AddSuccessDialog,
        ConfirmDialog
    },
    methods: {
        handleCodeInput(i) {
            this.copies[i].code = this.copies[i].code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        },
        addCopy() {
            this.copies.push({ code: "", location: null });
        },
        removeCopy(i) {
            if (this.copies.length > 1) {
                this.copies.splice(i, 1);
            }
        },
        isUnique(v, i) {
            const value = v?.trim().toUpperCase();
            return this.copies.every((copy, index) => {
                return index === i || !copy.code || copy.code?.trim().toUpperCase() !== value;
            });
        },
        async saveBook() {
            this.loading = true;
            const payload = {
                isbn: this.book.isbn,
                library: this.library.id,
                category: this.category,
                copies: this.copies
            }
            BookDataService.create(payload)
                .then(response => {
                    this.createdBook = response;
                    this.addSuccessDialog = true;
                })
                .catch(err => {
                    if (err.message.includes('[401]')) {
                        this.globalEmitter.emit('401');
                    } else if (err.message.includes('[403]')) {
                        this.globalEmitter.emit('403');
                    } else if (err.message.includes('[404]')) {
                        this.globalEmitter.emit('404');
                    } else if (err.message.includes('[400]')) {
                        const errorMessage = err.message.includes("Duplicate") ? "Il semblerait que vous ayez déjà un livre identifié avec ce code. Veuillez choisir un code unique pour votre exemplaire et réessayez..." : "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer...";
                        this.globalEmitter.emit('error', { message: errorMessage });
                    } else if (err.message.includes('[500]')) {
                        this.globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
                    } else {
                        this.globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },
    emits: ["previous", "cancel"]
}
</script>