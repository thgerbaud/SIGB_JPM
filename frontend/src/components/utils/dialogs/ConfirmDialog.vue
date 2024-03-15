<template>
    <v-dialog width="500" persistent>
        <v-card :title="title">
            <template v-slot:prepend>
                <v-icon :icon="icon || 'mdi-alert-circle'" color="warning"></v-icon>
            </template>
            <v-card-text v-if="text">
                {{ text }}
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" class="flex-grow-1" @click="emit('cancel')">{{ cancelText }}</v-btn>
                <v-btn class="flex-grow-1" @click="emit('ok')">{{ okText }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
defineProps(["title", "icon", "text", "cancelText", "okText"]);
const emit = defineEmits(["ok", "cancel"]);
</script>