<template>
    <v-dialog width="500" persistent>
        <v-card title="Erreur">
            <template v-slot:prepend>
                <v-icon icon="mdi-close-circle" color="error"></v-icon>
            </template>
            <v-card-text>
                {{ message || "Oups ! Une erreur s'est produite..." }}
            </v-card-text>
            <v-card-actions>
                <v-btn block @click="$emit('close')">Fermer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ["message"]
}
</script>