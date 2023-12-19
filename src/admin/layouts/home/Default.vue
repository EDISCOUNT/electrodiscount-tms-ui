<template>
    <v-app>
        <navigation-drawer/>
        <v-main>
            <v-card color="secondary-bg" flat>
                <v-card-text>
                    <v-card flat>
                        <v-card-title>
                            Admin Home
                        </v-card-title>
                        <v-card-text>
                            <v-card-subtitle>
                                <v-btn color="primary" :elevation="0" block="">Logout</v-btn>
                            </v-card-subtitle>
                        </v-card-text>
                    </v-card>
                </v-card-text>
            </v-card>
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
import NavigationDrawer from '@/admin/components/NavigationDrawer.vue';

</script>