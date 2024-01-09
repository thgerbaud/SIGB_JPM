<template>
    <v-dialog width="500" persistent>
        <v-card title="Session expirée">
            <template v-slot:prepend>
                <v-icon icon="mdi-timer-alert" color="error"></v-icon>
            </template>
            <v-card-text>
                "Votre session a expirée, veuillez vous reconnecter pour continuer !"
            </v-card-text>
            <v-card-actions>
                <v-btn block @click="$router.push('/login')">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>