<template>
    <v-dialog width="500" persistent>
        <v-card :title=title>
            <template v-slot:prepend>
                <v-icon icon="mdi-information" color="primary"></v-icon>
            </template>
            <v-card-text>
                {{ message }}
            </v-card-text>
            <v-card-actions>
                <v-btn block @click="emit('ok')">{{ btnText || "Ok" }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
defineProps(["title", "message", "btnText"]);
const emit = defineEmits(["ok"]);
</script>