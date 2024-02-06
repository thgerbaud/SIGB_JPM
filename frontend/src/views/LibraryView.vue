<template>
	<NavBar :library="library" v-if="library" />
	<v-main class="ma-4 bg-tertiary">
		<!-- global dialogs -->
		<ExpiredSessionDialog v-model="expiredSessionDialog" />
		<NotFoundDialog v-model="notFoundDialog" @ok="notFoundDialog = false" /> <!--? redirection ?-->
		<AccessDeniedDialog v-model="accessDeniedDialog" @ok="accessDeniedDialog = false" /> <!--? redirection ?-->
		<ErrorDialog v-model="errorDialog" :message="errorMessage" @close="errorDialog = false"/>
		<!-- view -->
		<router-view :library="library" v-if="library"></router-view>
	</v-main>
</template>

<script>
/* ----- components ----- */
import NavBar from '@/components/utils/nav/NavBar.vue';
import ExpiredSessionDialog from '@/components/utils/dialogs/ExpiredSessionDialog.vue';
import NotFoundDialog from '@/components/utils/dialogs/NotFoundDialog.vue';
import AccessDeniedDialog from '@/components/utils/dialogs/AccessDeniedDialog.vue';
import ErrorDialog from '@/components/utils/dialogs/ErrorDialog.vue';
/* ----- services ----- */
import LibraryDataService from '@/services/LibraryDataService';
/* ---------- */
export default {
	components: { NavBar, ExpiredSessionDialog, NotFoundDialog, AccessDeniedDialog, ErrorDialog },
	data() {
		return {
			library: this.$store.getters.getLibrary,
			/* ----- dialogs ----- */
			expiredSessionDialog: false,
			notFoundDialog: false,
			accessDeniedDialog: false,
			errorDialog: false,
			errorMessage: "Oups! Une erreur s'est produite..."
			/* ---------- */
		};
	},
	methods: {
		async retrieveLibrary() {
			if (this.library?.id !== this.$route.params.library) {
				await LibraryDataService.getLibrary(this.$route.params.library)
					.then(data => {
						this.library = data;
						console.log(this.library);
					})
					.catch(e => {
						console.log(e); //TODO
					});
			}
		},
	},
	async created() {
		/* ----- global events listeners ----- */
		this.globalEmitter.on('401', () => {
			this.expiredSessionDialog = true;
		});
		this.globalEmitter.on('403', () => {
			this.accessDeniedDialog = true;
		});
		this.globalEmitter.on('404', () => {
			this.notFoundDialog = true;
		});
		this.globalEmitter.on('error', ({message}) => {
			this.errorMessage = message || "Oups! Une erreur s'est produite"
			this.errorDialog = true;
		});
		/* ---------- */
		await this.retrieveLibrary();
	}
};
</script>