<template>
    <v-card height="100vh" :color="secondaryBg" flat>
        <v-card-text class="pa-0 pa-sm-4">
            <!-- {{ { filter, criteria, rsql: filter.filter } }} -->
            <!-- {{ {criteria} }} -->
            <v-card class="" flat>
                <template v-slot:title>
                    <v-toolbar color="transparent">
                        <template v-if="smAndUp">
                            <span>All Shipments</span>
                        </template>
                        <v-spacer />
                        <v-row v-if="selected?.length" class="px-md-5">
                            <BulkUpdateShipmentStatusButton @updated="() => refreshTable()" :shipments="selected"
                                :apply-transition="bulkApplyTransition" />
                            <v-spacer v-if="smAndUp" />
                            <span class="mx-1" v-else />
                            <PrintShipmentManifestButton :shipments="selected" variant="outlined" />
                            <ExportShipmentButton :shipments="selected" variant="outlined" class="mx-1" />
                            <ReturnShipmentButton :shipments="selected" variant="outlined" class="mx-1" @returned="() => refreshTable()" />
                            <DeleteShipmentButton :shipments="selected" variant="outlined" class="mx-1"  @deleted="() => refreshTable()"/>
                        </v-row>
                        <v-card-text v-else class="py-0">
                            <v-row class="pa-3" justify="space-between">
                                <ShipmentStatusFilter  @cleared="() => clearFilters()" v-if="mdAndUp" v-model="filter.status" :filter="filter.filter"
                                    url="/api/admin/shipment/shipments/count"
                                    :counter="({ status, filter }) => countShipments({ criteria: { status, filter } })"
                                    update-url-query multiple />
                                <ShipmentFilterBar v-model:filter="criteria" v-model:rsql="filter.filter"
                                    :code="filter.code" r-:status="filter.status" update-url-query v-else />
                                <BarcodeScannerButton v-model:result="filter.code" autoclose />
                            </v-row>
                        </v-card-text>
                    </v-toolbar>
                </template>
                <!-- <template v-slot:title> -->
                <!-- <div class="mt-2"> -->
                <!-- <v-toolbar-items> -->
                <ShipmentFilterBar v-if="mdAndUp" v-model:filter="criteria"  v-model:rsql="filter.filter"
                    r-:status="filter.status" update-url-query class="mt-2 px-5" />
                <!-- </v-toolbar-items> -->
                <!-- </div> -->
                <!-- </template> -->

                <template v-slot:append>
                    <create-shipment-button />
                </template>
            </v-card>



            <v-card class="mt-4 fill-height" flat>
                <v-card-text class="pb-0">
                    <shipment-table v-model="selected" :filter="{ ...(filter ?? {}), ...(criteria ?? {}) }" ref="table"
                        show-select />
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
import ExportShipmentButton from './partials/ExportShipmentButton.vue';
import ReturnShipmentButton from './partials/ReturnShipmentButton.vue';
import DeleteShipmentButton from './partials/DeleteShipmentButton.vue';
import ShipmentFilterBar from './partials/filtter/ShipmentFilterBar.vue';
import { useColorScheme } from '@/utils/color';
import { useDisplay } from 'vuetify';
import BarcodeScannerButton from '@/components/BarcodeScannerButton.vue';
import BulkUpdateShipmentStatusButton from '@/views/shipment/BulkUpdateShipmentStatusButton.vue';
import { bulkApplyTransition } from '@/admin/repository/shipment/shipment_repository';
import { countShipments } from '@/admin/repository/shipment/shipment_repository';
import { useRouter } from 'vue-router';

const filter = reactive({
    status: [] as string[],
    filter: undefined as string | undefined,
    code: undefined as string | undefined,
});


const table = ref<typeof ShipmentTable>();
const criteria = ref<{ [i: string]: any }>();

const router = useRouter();
const { secondaryBg } = useColorScheme();
const { xs, md, smAndDown, smAndUp, mdAndUp } = useDisplay();


const selected = ref<string[]>([]);


function clearFilters(){
    for(const key in filter){
        (filter as any)[key] = undefined;
    }
    criteria.value = {};
    // router
    // console.log("CLEARED FILTERS!!!");
}

function refreshTable() {
    table.value?.refresh();
}
</script>