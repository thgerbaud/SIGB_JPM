<template>
    <v-list-item class="bg-transparent pa-6 rounded-lg" value="create" @click="router.push('/home/create')">
        <template v-slot:prepend>
            <v-icon icon="mdi-plus"></v-icon>
        </template>
        <v-list-item-title v-text="'créer une bibliothèque'" class="text-h5" prepend-icon="mdi-plus"></v-list-item-title>
    </v-list-item>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>