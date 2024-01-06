<template>
    <v-navigation-drawer r-color="primary" expand-on-hover rail>

        <!-- <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height"> -->

        <template v-slot:prepend>
            <v-list-item v-if="user" prepend-avatar="AvatarImage" :title="user.fullName"
                :subtitle="user.username" nav>
                <template v-slot:append>
                </template>
            </v-list-item>
            <v-divider></v-divider>
        </template>

        <v-container class="fill-height pa-0 ma-0">
            <v-responsive class="align-center fill-height pa-0 ma-0">


                <v-list density="compact" nav>
                    <v-list-item prepend-icon="mdi-package-variant-closed" title="Shipments"
                        :to="{ name: 'carrier:shipment:index' }" value="myfiles"></v-list-item>

                    <template v-if="isGranted(['ROLE_ADMIN'])">
                        <v-list-item prepend-icon="mdi-account" title="Goto Admin" :to="{ name: 'admin:home' }"
                            value="admin-home"></v-list-item>
                    </template>

                </v-list>
            </v-responsive>
        </v-container>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useAccountStore, useUser } from '@/store/app';
import AvatarImage from '@/assets/images/avatar.png';

const { isGranted } = useAccountStore();
const { user, loading, error } = useUser();

</script>