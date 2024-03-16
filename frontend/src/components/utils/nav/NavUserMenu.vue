<template>
    <LogoutConfirmDialog v-model="logoutDialog" @cancel="logoutDialog = false" />

    <ConfirmDialog v-model="exitDialog" :title="`Quitter la bibliothèque ${libraryName} ?`" cancelText="Annuler"
        okText="Quitter" @cancel="exitDialog = false" @ok="exitLibrary" />

    <NavUserInfos :user="user" id="user-menu-activator" />
    <v-menu activator="#user-menu-activator">
        <v-list class="bg-primary-lighten-1 mt-4 rounded-lg">
            <v-list-item :title="user.email" class="ma-2 font-italic">
            </v-list-item>
            <v-list-item value="libraries" title="Mes bibliothèques" class="bg-primary" @click="exitDialog = true">
                <template v-slot:prepend>
                    <v-icon icon="mdi-library-shelves"></v-icon>
                </template>
            </v-list-item>
            <v-list-item value="logout" title="Déconnexion" class="bg-primary" @click="logoutDialog = true">
                <template v-slot:prepend>
                    <v-icon icon="mdi-logout"></v-icon>
                </template>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLibraryStore } from '@/store/library';
import NavUserInfos from '@/components/utils/nav/NavUserInfos.vue';
import LogoutConfirmDialog from '@/components/utils/dialogs/LogoutConfirmDialog.vue';
import ConfirmDialog from '@/components/utils/dialogs/ConfirmDialog.vue';

defineProps(["user", "libraryName"]);

const router = useRouter();
const libraryStore = useLibraryStore();

const logoutDialog = ref(false);
const exitDialog = ref(false);


function exitLibrary() {
    libraryStore.exitLibrary();
    router.push('/home/libraries');
}
</script>