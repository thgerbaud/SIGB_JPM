<template>
	<UserInfos :user="user" />
	<LibrariesList />
	<LogoutButton />
</template>

<script setup>
import { useUserStore } from '@/store/user';
import UserInfos from '@/components/home/UserInfos.vue';
import LibrariesList from '@/components/home/LibrariesList.vue';
import LogoutButton from '@/components/home/LogoutButton.vue';

const userStore = useUserStore();
const user = userStore.user;
</script>