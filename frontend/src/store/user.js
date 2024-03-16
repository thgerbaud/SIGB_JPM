import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useLibraryStore } from '@/store/library';

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
        libraryStore.exitLibrary();
        user.value = null;
        token.value = null;
    }

    return { user, token, isLoggedIn, setUser, setToken, logout }
}, { persist: true });