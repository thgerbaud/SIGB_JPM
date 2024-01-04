<template>
	<main>
		<UserInfos :user="user" />
		<LibrariesList :user="user" />
		<LogoutButton />
	</main>
</template>

<script>
import UserInfos from '@/components/home/UserInfos.vue';
import LibrariesList from '@/components/home/LibrariesList.vue';
import LogoutButton from '@/components/home/LogoutButton.vue';
export default {
	data() {
		return {
			user: this.$store.state.user
		};
	},
	components: {
		UserInfos,
		LibrariesList,
		LogoutButton
	}
}
</script>