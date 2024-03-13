<template>
    <tr>
        <td>{{ copy.code }}</td>
        <td>{{ locationToString(copy.location) }}</td>
        <td v-if="library.isAdmin">
            <v-icon icon="mdi-pencil" class="mr-4" @click="$emit('edit')"></v-icon>
            <v-icon icon="mdi-delete" color="error" @click="$emit('delete')"></v-icon>
        </td>
    </tr>
</template>

<script>
export default {
    props: ["copy", "library"],
    emits: ["edit", "delete"],
    methods: {
        locationToString(id) {
            const location = id ? this.library.locations?.find(location => location.id === id) : null
            if (location) {
                return location.name;
            } else {
                return "Non précisé"
            }
        }
    }
}
</script>