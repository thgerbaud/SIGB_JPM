import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useUserStore } from '@/store/user';

export const useLibraryStore = defineStore('library', () => {
    const library = ref(null);

    function setLibrary(libraryValue) {
        const userStore = useUserStore();
        library.value = libraryValue;
        library.value.isAdmin = !!libraryValue?.admins?.find(admin => admin.email === userStore.user?.email);
    }

    function exitLibrary() {
        library.value = null;
    }

    return { library, setLibrary, exitLibrary }
}, { persist: true });