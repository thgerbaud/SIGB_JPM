import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useBooksDetailsStore = defineStore('books-details', () => {
    const details = ref({});

    function setDetails(isbn, data) {
        details.value[isbn] = data;
    }

    function removeDetails(isbn) {
        delete details.value[isbn];
    }

    function clearStore() {
        details.value = {};
    }

    return { details, setDetails, removeDetails, clearStore }
}, { persist: true });