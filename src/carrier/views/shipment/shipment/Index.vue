<template>
    <v-card height="100vh" :color="secondaryBg" flat>
        <v-card-text class="pa-0 pa-sm-4">
            <v-card color="background" class="" flat>
                <template v-slot:title>
                    <v-toolbar color="transparent">
                        <span v-if="smAndUp"> Shipments</span>
                        <v-spacer />
                        <v-card-text v-if="selected?.length">
                            <PrintShipmentManifestButton :shipments="selected" />
                           <BulkUpdateShipmentStatusButton
                           :apply-transition="bulkApplyTransition"
                           @updated="() => refreshTable()"
                           :shipments="selected"/>
                        </v-card-text>
                        <v-card-text v-else class="py-0">
                            <v-row class="pa-3" justify="space-between">
                                <ShipmentStatusFilter v-if="mdAndUp" v-model="filter.status" />
                                <ShipmentFilterBar v-model:rsql="filter.filter" v-else />
                                <BarcodeScannerButton/>
                            </v-row>
                        </v-card-text>
                    </v-toolbar>
                </template>
                <!-- <template v-slot:title> -->
                <!-- <div class="mt-2"> -->
                <!-- <v-toolbar-items> -->
                <ShipmentFilterBar v-if="mdAndUp" v-model:rsql="filter.filter" class="mt-2 px-5" />
                <!-- </v-toolbar-items> -->
                <!-- </div> -->
                <!-- </template> -->

                <template v-slot:append>
                    <create-shipment-button />
                </template>
            </v-card>



            <v-card class="mt-4 fill-height" flat>
                <v-card-text>
                    <shipment-table v-model="selected" :filter="filter" ref="table" show-select />
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
import ShipmentFilterBar from './partials/filtter/ShipmentFilterBar.vue';
import { useColorScheme } from '@/utils/color';
import { useDisplay } from 'vuetify';
import BarcodeScannerButton from '@/components/BarcodeScannerButton.vue';
import BulkUpdateShipmentStatusButton from '@/views/shipment/BulkUpdateShipmentStatusButton.vue';
import { bulkApplyTransition } from '@/carrier/repository/shipment/shipment_repository';

const filter = reactive({
    status: [] as string[],
    filter: undefined as string | undefined,
});


const table = ref<typeof ShipmentTable>();

const { secondaryBg } = useColorScheme();
const { xs, md, smAndDown, smAndUp, mdAndUp } = useDisplay();


const selected = ref<string[]>([]);



function refreshTable(){
    table.value?.refresh();
}
</script>