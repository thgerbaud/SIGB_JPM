import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useUserStore } from '@/store/user';

export const useLibraryStore = defineStore('library', () => {
    const library = ref(null);
    const books = ref([]); // uniquement pour vérifier la présence d'un livre lors d'un ajout

    function setLibrary(libraryValue) {
        const userStore = useUserStore();
        library.value = libraryValue;
        library.value.isAdmin = !!libraryValue?.admins?.find(admin => admin.email === userStore.user?.email);
    }

    function setBooks(booksValue) {
        books.value = booksValue;
    }

    function addBook(book) {
        books.value.push(book);
    }

    function exitLibrary() {
        library.value = null;
        books.value = [];
    }

    return { library, books, setLibrary, exitLibrary, setBooks, addBook }
}, { persist: true });