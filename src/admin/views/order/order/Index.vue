<template>
    <v-card height="100vh" color="secondary-bg" flat>
        <v-card-text class="pa-0 pa-md-3 pt-md-0" >
            <v-card class="" v-if="false" flat>
                <template v-slot:title>
                    <span> Orders</span>
                </template>

                <template v-slot:append>
                    <create-order-button />
                </template>
            </v-card>

            <!-- <v-card class="mt-4" flat>
                <v-card-text>
                    <order-filter-bar />
                </v-card-text>
            </v-card> -->


            <v-card class="mt-0 fill-height" flat>
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
import OrderFilterBar from './partials/OrderFilterBar.vue';


</script>