<template>
    <v-dialog width="500" persistent>
        <v-card title="Accès refusé">
            <template v-slot:prepend>
                <v-icon icon="mdi-lock" color="error"></v-icon>
            </template>
            <v-card-text>
                Oups... Il semblerait que vous n'ayez pas les permissions nécessaires pour accéder à cette ressource ou effectuer cette opération.
            </v-card-text>
            <v-card-actions>
                <v-btn block @click="emit('ok')">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
const emit = defineEmits(["ok"]);
</script>