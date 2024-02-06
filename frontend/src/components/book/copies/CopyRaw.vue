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
        locationToString(i) {
            const locationIndex = i ?? -1;
            if (locationIndex > this.library.locations.length || locationIndex < 0) {
                return "Non précisé"
            } else {
                return this.library.locations[locationIndex];
            }
        }
    }
}
</script>