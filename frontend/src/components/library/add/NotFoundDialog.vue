<template>
    <v-dialog width="500" persistent>
        <v-card title="Aucun résultat">
            <template v-slot:prepend>
                <v-icon icon="mdi-alert-circle" color="warning"></v-icon>
            </template>
            <v-card-text>
                Aucun livre trouvé pour le numéro ISBN {{ isbn }}, vérifiez le numéro et essayez à nouveau.
            </v-card-text>
            <v-card-actions>
                <v-btn block @click="$emit('close')">Fermer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ["isbn"]
}
</script>