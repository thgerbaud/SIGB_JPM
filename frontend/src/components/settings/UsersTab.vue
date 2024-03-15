<template>
    <AdminsSection :library="library" />

    <GuestsSection :library="library" />
</template>

<script setup>
import AdminsSection from '@/components/settings/users/admins/AdminsSection.vue';
import GuestsSection from '@/components/settings/users/guests/GuestsSection.vue';

defineProps(["library"]);
</script>