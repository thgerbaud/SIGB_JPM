<template>
    <v-dialog width="500" persistent>
        <v-card title="Se déconnecter ?">
            <template v-slot:prepend>
                <v-icon icon="mdi-logout"></v-icon>
            </template>
            <v-card-actions>
                <v-btn color="error" class="flex-grow-1" @click="$emit('cancel')">Annuler</v-btn>
                <v-btn class="flex-grow-1" @click="logout">Confirmer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    methods: {
        logout() {
            this.$store.commit('logout');
            this.$router.push('/');
        }
    }
}
</script>