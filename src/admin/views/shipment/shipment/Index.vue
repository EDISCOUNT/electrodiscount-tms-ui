<template>
    <v-card height="100vh" color="secondary-bg" flat>
        <v-card-text class="pa-0 pa-sm-4">
            <v-card class="" flat>
                <template v-slot:title>
                    <span> Shipments</span>
                </template>

                <template v-slot:append>
                    <create-shipment-button />
                </template>
            </v-card>



            <v-card class="mt-4 fill-height" flat>
                <v-card-text v-if="selected?.length">
                    <PrintShipmentManifestButton :shipments="selected" />
                </v-card-text>
                <v-card-text v-else class="py-0">
                    <v-row class="pa-3" justify="space-between">
                        <div>
                            Actions
                            <!-- {{ {selected} }} -->
                        </div>
                        <ShipmentStatusFilter v-model="filter.status" />
                    </v-row>
                </v-card-text>
                <v-card-text>
                    <shipment-table v-model="selected" :filter="filter" show-select />
                </v-card-text>
            </v-card>

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import ShipmentTable from './partials/ShipmentTable.vue';
import CreateShipmentButton from './partials/CreateShipmentButton.vue';
import ShipmentStatusFilter from '@/views/shipment/filter/ShipmentStatusFilter.vue';
import { reactive } from 'vue';
import { ref } from 'vue';
import PrintShipmentManifestButton from './partials/PrintShipmentManifestButton.vue';

const filter = reactive({
    status: [] as string[],
});


const selected = ref<string[]>([]);
</script>