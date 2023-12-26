<template>
    <v-card height="100vh" color="secondary-bg" flat>
        <v-card-text>
            <v-card class="" flat>
                <template v-slot:title>
                    <span> Users</span>
                </template>

                <template v-slot:append>
                   <create-user-button/>
                </template>
            </v-card>

            <v-card class="mt-4 fill-height" flat>
                <v-card-text>
                    <user-table />
                </v-card-text>
            </v-card>

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import UserTable from './partials/UserTable.vue';
import CreateUserButton from './partials/CreateUserButton.vue';

</script>