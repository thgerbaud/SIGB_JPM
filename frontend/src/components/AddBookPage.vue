<template>
    <section>
        <h2 class="text-h2 mb-8 text-center">Ajouter un livre</h2>

        <SearchIsbn v-if="!bookFound" @cancel="returnHome" @found="(datas) => bookFound = datas" />

        <IsbnResult v-else-if="!addBook" :book="bookFound" @previous="goBack" @cancel="returnHome" @next="addBook = true" />

        <AddBookForm v-else :library="library" :book="bookFound" @previous="goBack" @cancel="returnHome" />

    </section>
</template>

<script>
import SearchIsbn from '@/components/library/add/SearchIsbn.vue';
import IsbnResult from '@/components/library/add/IsbnResult.vue';
import AddBookForm from '@/components/library/add/AddBookForm.vue';
export default {
    props: ["library"],
    data() {
        return {
            bookFound: null,
            addBook: false,
        }
    },
    components: {
        SearchIsbn,
        IsbnResult,
        AddBookForm
    },
    methods: {
        goBack() {
            this.isbn = "";
            this.addSuccessDialog = false;
            this.addBook = false;
            this.bookFound = null;
        },
        returnHome() {
            this.$router.push(`/${this.library.id}/books/`);
        }
    }
}
</script>