<template>
    <v-card class="d-flex" variant="flat">
        <div class="flex-grow-1">
            <v-card-item>
                <v-card-text class="text-body-1">
                    <DetailsSection :book="book" :library="library" />
                </v-card-text>
            </v-card-item>
        </div>
        <div>
            <v-img :src="book.details?.image" width="250"></v-img>
        </div>
    </v-card>
</template>

<script setup>
import DetailsSection from '@/components/book/DetailsSection.vue';

defineProps(["book", "library"]);
</script>