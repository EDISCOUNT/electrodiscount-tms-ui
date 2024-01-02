<template>
    <v-card r-height="100vh" r-color="secondary-bg" flat>
        <v-divider/>
        <v-card-text class="pa-0">
            <v-card class="" flat>
                <template v-slot:title>
                    <span> Shipments</span>
                </template>

                <template v-slot:append>
                    <!-- <create-shipment-button /> -->
                </template>
            </v-card>
        <v-divider/>


          
            <v-card class="mt-4 fill-height" flat>
                <v-card-text>
                    <shipment-table show-select />
                </v-card-text>
            </v-card>

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import ShipmentTable from './partials/ShipmentTable.vue';
// import CreateShipmentButton from './partials/CreateShipmentButton.vue';

</script>