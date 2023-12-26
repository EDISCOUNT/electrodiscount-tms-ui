<template>
    <v-app>
        <navigation-drawer/>
        <v-main>
            <router-view/>
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
import NavigationDrawer from '@/carrier/components/NavigationDrawer.vue';

</script>
