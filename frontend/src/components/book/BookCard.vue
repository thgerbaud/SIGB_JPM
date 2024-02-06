<template>
    <v-card class="d-flex" variant="flat">
        <div class="flex-grow-1">
            <v-card-item>
                <v-card-text class="text-body-1">
                    <DetailsSection :book="book" :library="library" />
                    <CopiesSection :book="book" :library="library" @update="updateBook"/>
                </v-card-text>
            </v-card-item>
        </div>
        <div>
            <v-img :src="book.details?.image" width="250"></v-img>
        </div>
    </v-card>
</template>

<script>
import CopiesSection from '@/components/book/copies/CopiesSection.vue';
import DetailsSection from '@/components/book/DetailsSection.vue';
export default {
    props: ["book", "library"],
    components: {
        CopiesSection,
        DetailsSection
    },
    methods: {
        updateBook(updatedBook) {
            this.$emit('update', updatedBook);
        },
    },
    emits: ["update"]
}
</script>