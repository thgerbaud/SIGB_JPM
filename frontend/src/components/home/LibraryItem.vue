<template>
    <router-link class="library-item" :to="`/${library.id}/books`">
        <div class="library-name">{{ library.name }}</div>
        <div>></div>
    </router-link>
</template>

<script>
export default {
    props: ["library"]
}
</script>

<style scoped>
.library-item {
	font-size: var(--medium3);
	padding: 1rem 1.5rem;
	border-radius: 5px;
	background-color: var(--primary-light);
	color: white;
	text-decoration: none;
	display: flex;
}

.library-item:hover {
	opacity: 60%;
}

.library-name {
	flex-grow: 1;
}
</style>