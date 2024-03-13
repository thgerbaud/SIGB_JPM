<template>
    <AdminsSection :library="library" />

    <GuestsSection :library="library" />
</template>

<script>
import AdminsSection from '@/components/settings/users/admins/AdminsSection.vue';
import GuestsSection from '@/components/settings/users/guests/GuestsSection.vue';
export default {
    props: ["library"],
    components: {
        AdminsSection,
        GuestsSection,
    },
}
</script>