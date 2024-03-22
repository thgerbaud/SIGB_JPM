<template>
	<SectionTemplate title="Ma bibliothèque">
		<BooksSection :library="library" />
		<v-btn v-if="library.isAdmin" prepend-icon="mdi-plus" @click="router.push(`/${library.id}/books/add`)"> ajouter
			un livre</v-btn>
	</SectionTemplate>
</template>
	
<script setup>
import { useRouter } from 'vue-router';
import BooksSection from '@/components/library/home/BooksSection.vue';
import SectionTemplate from '@/components/utils/SectionTemplate.vue';

defineProps(["library"]);
const router = useRouter();
</script>