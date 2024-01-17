<template>
    <v-dialog width="500" persistent>
        <v-card title="Ressource introuvable">
            <template v-slot:prepend>
                <v-icon icon="mdi-help" color="error"></v-icon>
            </template>
            <v-card-text>
                Oups... Il semblerait que la ressource à laquelle vous essayez d'accéder n'existe pas.
            </v-card-text>
            <v-card-actions>
                <v-btn block @click="$emit('ok')">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    emits: ["ok"]
}
</script>