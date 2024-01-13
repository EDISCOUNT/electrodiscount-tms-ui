<template>
    <v-app>
        <v-main>
            <v-row justify="center" align="center" class="fill-height">
                <v-card min-width="300px" flat>
                    <template v-slot:title>
                        <span v-show="loading">Please wait...</span>
                    </template>
                    <v-card-text v-if="error">
                        <v-alert type="error" dismissible>
                            {{ error }}
                        </v-alert>
                    </v-card-text>
                    <v-card-text>
                        <v-progress-linear :indeterminate="loading" />
                    </v-card-text>
                </v-card>
            </v-row>
        </v-main>
    </v-app>
</template>
<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore, useUser } from '@/store/app';


const router = useRouter();
const { isGranted } = useAccountStore();
const { user, loading, error } = useUser();



watch(user, (user) => authGuard(), {deep: true});
onMounted(() => authGuard());


function authGuard() {

    if (isGranted('ROLE_ADMIN')) {
        router.replace({ name: 'admin:home' });
    }
    else if (isGranted('ROLE_CARRIER_OPERATOR')) {
        router.replace({ name: 'carrier:home' });
    }
}
</script>