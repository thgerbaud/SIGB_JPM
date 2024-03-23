<template>
	<NavBar :library="library" v-if="library" />
	<v-main class="ma-4 bg-background">
		<ExpiredSessionDialog v-model="expiredSessionDialog" />
		<NotFoundDialog v-model="notFoundDialog" @ok="goBack" />
		<AccessDeniedDialog v-model="accessDeniedDialog" @ok="goBack" />
		<ErrorDialog v-model="errorDialog" :message="errorMessage" @close="errorDialog = false" />
		
		<router-view :library="library" v-if="library"></router-view>
	</v-main>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import { useLibraryStore } from '@/store/library';
import { useRoute, RouterView } from 'vue-router';
import NavBar from '@/components/utils/nav/NavBar.vue';
import ExpiredSessionDialog from '@/components/utils/dialogs/ExpiredSessionDialog.vue';
import NotFoundDialog from '@/components/utils/dialogs/NotFoundDialog.vue';
import AccessDeniedDialog from '@/components/utils/dialogs/AccessDeniedDialog.vue';
import ErrorDialog from '@/components/utils/dialogs/ErrorDialog.vue';
import { getLibrary } from '@/services/LibraryDataService';
import router from '@/router';

const libraryStore = useLibraryStore();
const route = useRoute();
const globalEmitter = inject('globalEmitter');

const expiredSessionDialog = ref(false);
const notFoundDialog = ref(false);
const accessDeniedDialog = ref(false);
const errorDialog = ref(false);
const errorMessage = ref("Oups! Une erreur s'est produite...");

const library = computed(() => libraryStore.library);

function goBack() {
	router.back();
}

async function retrieveLibrary() {
	if (library?.id !== route.params.library) {
		await getLibrary(route.params.library)
			.then(library => {
				libraryStore.setLibrary(library);
			})
			.catch(err => {
            if (err.message.includes('[401]')) {
                globalEmitter.emit('401');
            } else if (err.message.includes('[403]')) {
                globalEmitter.emit('403');
            } else if (err.message.includes('[404]')) {
                globalEmitter.emit('404');
            } else if (err.message.includes('[500]')) {
                globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
            } else {
                globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
            }
        })
	}
}

globalEmitter.on('401', () => {
	expiredSessionDialog.value = true;
});

globalEmitter.on('403', () => {
	accessDeniedDialog.value = true;
});

globalEmitter.on('404', () => {
	notFoundDialog.value = true;
});

globalEmitter.on('error', ({ message }) => {
	errorMessage.value = message || "Oups! Une erreur s'est produite"
	errorDialog.value = true;
});

retrieveLibrary();
</script>