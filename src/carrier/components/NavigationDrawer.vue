<template>
    <v-app-bar flat>

        <!-- <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height"> -->

        <template v-slot:prepend>
            <v-list-item v-if="user" prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" :title="user.fullName"
                :subtitle="user.username" nav>
                <template v-slot:append>
                </template>
            </v-list-item>
            <v-divider></v-divider>
        </template>


        <v-toolbar-items>
            <v-list-item prepend-icon="mdi-package-variant-closed" title="Shipments"
                :to="{ name: 'carrier:shipment:index' }" value="myfiles"></v-list-item>

            <template v-if="isGranted(['ROLE_ADMIN'])">
                <v-list-item prepend-icon="mdi-account" title="Goto Admin" :to="{ name: 'admin:home' }"
                    value="admin-home"></v-list-item>
            </template>
        </v-toolbar-items>
    </v-app-bar>
</template>

<script lang="ts" setup>
import { useAccountStore, useUser } from '@/store/app';

const { isGranted } = useAccountStore();
const { user, loading, error } = useUser();

</script>