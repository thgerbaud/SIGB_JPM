<template>
    <v-list-item>
        <v-list-item-title>
            <span :class="{ active: hover }">- {{ title }}</span>
        </v-list-item-title>
        <template #append>
            <div @mouseover="hover = true" @mouseleave="hover = false" v-if="mdAndUp">
                <v-btn-secondary prepend-icon="mdi-pencil-outline" class="mr-2" density="comfortable"
                    @click="emit('edit')">Modifier</v-btn-secondary>
                <v-btn-cancel prepend-icon="mdi-delete-outline" density="comfortable" @click="emit('delete')"
                    :loading="loading">Supprimer</v-btn-cancel>
            </div>
            <div @mouseover="hover = true" @mouseleave="hover = false" v-else>
                <v-btn-secondary icon="mdi-pencil-outline" class="mr-2" density="comfortable"
                    @click="emit('edit')" size="small"></v-btn-secondary>
                <v-btn-cancel icon="mdi-delete-outline" density="comfortable" @click="emit('delete')"
                    :loading="loading" size="small"></v-btn-cancel>
            </div>
        </template>
    </v-list-item>
</template>

<script setup>
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

defineProps(["title", "loading"]);
const emit = defineEmits(["edit", "delete"]);
const { mdAndUp } = useDisplay();

const hover = ref(false);
</script>

<style scoped>
.active {
    font-weight: bold;
}
</style>