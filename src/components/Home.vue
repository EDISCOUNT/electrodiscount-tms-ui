<template>
    <v-app>
        <v-main>
            <v-row justify="center" align="center" class="fill-height">
                <v-card flat>
                    <template v-slot:title>
                        Please wait...
                    </template>
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
const {user} = useUser();



watch(user, (user) => authGuard());
onMounted(() => authGuard());


function authGuard(){
    
    if (isGranted('ROLE_ADMIN')) {
        router.replace({ name: 'admin:home' });
    }
    else if (isGranted('ROLE_CARRIER_OPERATOR')) {
        router.replace({ name: 'carrier:home' });
    }
}
</script>