<template>
	<v-app id="app">
		<router-view />
	</v-app>
</template>

<script>
export default {
	name: "app"
};
</script>

<style>
div.v-application__wrap {
	/* avoid overflow due to v-app-bar */
	min-height: 100vh !important;
}
</style>