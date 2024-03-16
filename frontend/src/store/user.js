import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useLibraryStore } from '@/store/library';
import { useBooksDetailsStore } from '@/store/booksDetails';

export const useUserStore = defineStore('user', () => {
    const user = ref(null);
    const token = ref(null);

    const isLoggedIn = computed(() => {
        return !!token.value;
    });

    function setUser(userValue) {
        user.value = userValue;
    }

    function setToken(tokenValue) {
        token.value = tokenValue;
    }

    function logout() {
        const libraryStore = useLibraryStore();
        const booksDetailsStore = useBooksDetailsStore();
        libraryStore.exitLibrary();
        booksDetailsStore.clearStore();
        user.value = null;
        token.value = null;
    }

    return { user, token, isLoggedIn, setUser, setToken, logout }
}, { persist: true });