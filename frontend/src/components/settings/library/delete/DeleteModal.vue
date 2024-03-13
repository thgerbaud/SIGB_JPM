<template>
    <v-dialog width="500" persistent>
        <v-card title="Supprimer la bibliothèque">
            <template v-slot:prepend>
                <v-icon icon="mdi-delete-alert" color="error"></v-icon>
            </template>
            <v-card-text>
                <p class="mb-2">Vous vous apprêtez à supprimer la bibliothèque et tous les exemplaires qu'elle contient,
                    cette action est irréversible.</p>
                <p class="mb-2">Pour confirmer, tapez «<b>{{ name }}</b>» dans le champ ci-dessous :</p>
                <v-form v-model="isFormValid">
                    <v-text-field variant="outlined" :placeholder="name" :rules="[rules.matches]" hide-details
                        :disabled="loading"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn class="flex-grow-1" @click="$emit('cancel')" :disabled="loading">Annuler</v-btn>
                <v-btn class="flex-grow-1" color="error" @click="confirm" :disabled="!isFormValid"
                    :loading="loading">Supprimer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ["name"],
    data() {
        return {
            isFormValid: false,
            loading: false,
            rules: {
                matches: (value) => value === this.name || "",
            },
        }
    },
    methods: {
        confirm() {
            this.loading = true;
            this.$emit('delete');
        },
    },
    emits: ["cancel", "delete"],
}
</script>