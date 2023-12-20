<template>
    <v-card height="100vh" color="secondary-bg" flat>
        <v-card-text>
            <v-card class="" flat>
                <template v-slot:title>
                    <span> Orders Index</span>
                </template>

                <template v-slot:append>
                    <create-order-button/>
                </template>
            </v-card>

            <v-card class="mt-4 fill-height" flat>
                <!-- <v-card-text> -->
                    <order-table />
                <!-- </v-card-text> -->
            </v-card>

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import OrderTable from './partials/OrderTable.vue';
import CreateOrderButton from './partials/CreateOrderButton.vue';


</script>