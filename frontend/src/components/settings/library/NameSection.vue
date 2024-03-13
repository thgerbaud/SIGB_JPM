<template>
    <SettingsSectionTemplate title="Nom">
        <template #content>
            <p>{{ library.name }}</p>
        </template>
    </SettingsSectionTemplate>
</template>

<script>
import SettingsSectionTemplate from '@/components/settings/SettingsSectionTemplate.vue';
export default {
    props: ["library"],
    data() {
        return {
            maxAdmins: 3,
        }
    },
    components: {
        SettingsSectionTemplate,
    },
}
</script>