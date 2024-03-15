<template>
	<UserInfos :user="user" />
	<LibrariesList />
	<LogoutButton />
</template>

<script setup>
import { useStore } from 'vuex';
import UserInfos from '@/components/home/UserInfos.vue';
import LibrariesList from '@/components/home/LibrariesList.vue';
import LogoutButton from '@/components/home/LogoutButton.vue';

const store = useStore();
const user = store.state.user;
</script>