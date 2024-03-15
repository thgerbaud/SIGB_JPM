<template>
    <section>
        <h2 class="text-h2 mb-8 text-center">Ajouter un livre</h2>

        <SearchIsbn v-if="!bookFound" @cancel="returnHome" @found="(datas) => bookFound = datas" />

        <IsbnResult v-else-if="!addBook" :book="bookFound" @previous="goBack" @cancel="returnHome" @next="addBook = true" />

        <AddBookForm v-else :library="library" :book="bookFound" @previous="goBack" @cancel="returnHome" />

    </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SearchIsbn from '@/components/library/add/SearchIsbn.vue';
import IsbnResult from '@/components/library/add/IsbnResult.vue';
import AddBookForm from '@/components/library/add/AddBookForm.vue';

const props = defineProps(["library"]);
const router = useRouter();

const bookFound = ref(null);
const addBook = ref(false);

function goBack() {
    addBook.value = false;
    bookFound.value = null;
}

function returnHome() {
    router.push(`/${props.library.id}/books/`);
}
</script>