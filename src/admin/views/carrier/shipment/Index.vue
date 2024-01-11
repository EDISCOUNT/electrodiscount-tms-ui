<template>
    <v-card height="100vh" color="secondary-bg" flat>
        <v-card-text class="pa-0 pa-md-3 pt-md-0" >
            <v-card class="" v-if="false" flat>
                <template v-slot:title>
                    <span> Shipments</span>
                </template>

                <template v-slot:append>
                    <create-shipment-button />
                </template>
            </v-card>

            <!-- <v-card class="mt-4" flat>
                <v-card-text>
                    <shipment-filter-bar />
                </v-card-text>
            </v-card> -->


            <v-card class="mt-0 fill-height" flat>
                <!-- <v-card-text> -->
                    <carrier-shipment-tabs/>
                <!-- </v-card-text> -->
            </v-card>

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import CarrierShipmentTabs from './partials/CarrierShipmentTabs.vue';
// import CreateShipmentButton from './partials/CreateShipmentButton.vue';
// import ShipmentFilterBar from './partials/ShipmentFilterBar.vue';


</script>