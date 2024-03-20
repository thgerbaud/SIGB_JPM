<template>
	<NavBar :library="library" v-if="library" />
	<v-main class="ma-4 bg-background">
		<!-- global dialogs -->
		<ExpiredSessionDialog v-model="expiredSessionDialog" />
		<NotFoundDialog v-model="notFoundDialog" @ok="notFoundDialog = false" /> <!--? redirection ?-->
		<AccessDeniedDialog v-model="accessDeniedDialog" @ok="accessDeniedDialog = false" /> <!--? redirection ?-->
		<ErrorDialog v-model="errorDialog" :message="errorMessage" @close="errorDialog = false" />
		<!-- view -->
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

const libraryStore = useLibraryStore();
const route = useRoute();
const globalEmitter = inject('globalEmitter');

const expiredSessionDialog = ref(false);
const notFoundDialog = ref(false);
const accessDeniedDialog = ref(false);
const errorDialog = ref(false);
const errorMessage = ref("Oups! Une erreur s'est produite...");

const library = computed(() => libraryStore.library);

async function retrieveLibrary() {
	if (library?.id !== route.params.library) {
		await getLibrary(route.params.library)
			.then(library => {
				libraryStore.setLibrary(library);
			})
			.catch(e => {
				console.log(e); //TODO
			});
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