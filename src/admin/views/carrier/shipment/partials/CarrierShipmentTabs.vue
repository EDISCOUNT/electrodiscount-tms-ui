<template>
    <v-card :height="height ?? 'calc(100vh - 0px)'" color="secondary-bg" flat>

        <template v-if="pagination">
            <v-card v-if="pagination.pageInfo.totalItems" width="100%" color="transparent" flat>
                <v-card-title class="pa-0">
                    <v-toolbar class="pa-3" color="background" flat>
                        <template v-slot:title v-if="smAndUp">
                            <span> Shipments</span>
                        </template>
                        <v-spacer />
                        <v-row v-if="selected?.length" class="px-md-5">
                            <BulkUpdateShipmentStatusButton @updated="() => refreshTable()" :shipments="selected"
                                :apply-transition="bulkApplyTransition" />
                            <v-spacer v-if="smAndUp" />
                            <span class="mx-1" v-else />
                            <PrintShipmentManifestButton :shipments="selected" variant="outlined" />
                            <ExportShipmentButton :shipments="selected" variant="outlined" class="mx-1" />
                        </v-row>
                        <v-card-text v-else class="py-0">
                            <v-row class="pa-3" justify="space-between">
                                <ShipmentStatusFilter v-if="mdAndUp" v-model="filter.status" multiple />
                                <ShipmentFilterBar v-model:rsql="filter.filter" :code="filter.code" :status="filter.status"
                                    update-url-query no-carrier v-else />
                                <BarcodeScannerButton v-model:result="filter.code" autoclose />
                            </v-row>
                        </v-card-text>
                        <template v-slot:extension>
                            <!-- <v-card-text class="pa-0">
                                <v-card class="pink" flat>
                                    <ShipmentFilterBar v-if="mdAndUp" v-model:rsql="filter.filter" :status="filter.status"
                                        update-url-query no-carrier class="mt-2 px-5" />
                                </v-card>
                            </v-card-text> -->

                            <v-tabs v-model="tab" r-bg-color="primary" align-tabs="start" mobile-breakpoint="xs">
                                <v-tab v-for="(carrier) in pagination.items" :key="carrier.id" :value="carrier.id"
                                    r-:to="{ name: 'admin:carrier:shipment:index', params: { id: carrier.id } }">
                                    <v-list-item>
                                        <template v-slot:prepend>
                                            <v-avatar color="primary">
                                                <v-img v-if="carrier.logoImage" :src="carrier.logoImage.url" />
                                                <span v-else class="text-h5">
                                                    {{ carrier.name.slice(0, 1).toUpperCase() }}
                                                </span>
                                            </v-avatar>
                                        </template>
                                        <template v-slot:title>
                                            {{ carrier.name }}
                                        </template>
                                        <!-- <template v-slot:subtitle>
                                        {{ carrier.typeConfig.subtitle }}
                                    </template> -->
                                    </v-list-item>
                                </v-tab>
                            </v-tabs>
                        </template>

                        <!-- <v-tabs v-model="tab" r-bg-color="primary" align-tabs="start" mobile-breakpoint="xs"> -->
                        <!-- <v-tab v-for="(carrier) in pagination.items" :key="carrier.id" :value="carrier.id"
                                r-:to="{ name: 'admin:carrier:shipment:index', params: { id: carrier.id } }">
                                <v-list-item>
                                    <template v-slot:prepend>
                                        <v-avatar color="primary">
                                            <v-img v-if="carrier.logoImage" :src="carrier.logoImage.url" />
                                            <span v-else class="text-h5">
                                                {{ carrier.name.slice(0, 1).toUpperCase() }}
                                            </span>
                                        </v-avatar>
                                    </template>
                                    <template v-slot:title>
                                        {{ carrier.name }}
                                    </template>
                                </v-list-item>
                            </v-tab> -->
                        <!-- </v-tabs> -->
                    </v-toolbar>
                </v-card-title>

                <v-card-text class="pa-0 mt-4">
                    <v-card flat>
                        <v-window v-model="tab" :touch="false">
                            <v-window-item v-for="(carrier) in pagination.items" :key="carrier.id" :value="carrier.id">
                                <v-card color="transparent" flat>

                                    <v-card-text class="pa-0">
                                        <carrier-shipment-table :carrier="carrier" show-select :filter="filter"
                                            height="calc(100vh - 250px)" />
                                    </v-card-text>
                                </v-card>
                            </v-window-item>
                        </v-window>
                    </v-card>
                </v-card-text>
            </v-card>
        </template>



        <v-row justify="center" align="center" class="fill-height" v-else-if="loading">
            <v-card width="400px" flat>
                <v-card-subtitle>Loading...</v-card-subtitle>
                <v-card-text>
                    <v-progress-linear indeterminate color="primary"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-row>

        <v-row justify="center" align="center" class="fill-height" v-else>
            <v-card width="400px" flat>
                <v-card-title>
                    Seems an Error Occured
                </v-card-title>
                <v-card-text>
                    <v-alert type="error" dismissible>
                        {{ error }}
                    </v-alert>
                </v-card-text>
            </v-card>
        </v-row>

        <!-- </v-card-text> -->
    </v-card>
</template>

<script lang="ts" setup>
import useSWRV from 'swrv';
import { ref, watch } from 'vue';
// import ShipmentTable from '@/admin/views/shipment/shipment/partials/ShipmentTable.vue';
import CarrierShipmentTable from './CarrierShipmentTable.vue';
import { getPaginatedCarriers } from '../../../../repository/carrier/carrier_repository';
// 

import CreateShipmentButton from '@/admin/views/shipment/shipment/partials/CreateShipmentButton.vue';
import ShipmentStatusFilter from '@/views/shipment/filter/ShipmentStatusFilter.vue';
import { reactive } from 'vue';
import PrintShipmentManifestButton from '@/admin/views/shipment/shipment/partials/PrintShipmentManifestButton.vue';
import ExportShipmentButton from '@/admin/views/shipment/shipment/partials/ExportShipmentButton.vue';
import ShipmentFilterBar from '@/admin/views/shipment/shipment/partials/filtter/ShipmentFilterBar.vue';
import { useColorScheme } from '@/utils/color';
import { useDisplay } from 'vuetify';
import BarcodeScannerButton from '@/components/BarcodeScannerButton.vue';
import BulkUpdateShipmentStatusButton from '@/views/shipment/BulkUpdateShipmentStatusButton.vue';
import { bulkApplyTransition } from '@/admin/repository/shipment/shipment_repository';

const props = defineProps<{
    height?: number | string;
    id?: string;
}>();



const { data: pagination, isValidating: loading, error } = useSWRV(
    `/api/admin/carrier/carriers`,
    () => getPaginatedCarriers({ limit: 100, page: 1, criteria: { enabled: true }, sortBy: { name: 'asc' } }),
);

watch(() => props.id, async (id) => {
    if (id) {
        // await loadCarrier(id);
        tab.value = id;
    }
});


const tab = ref<string>();

// 


const filter = reactive({
    status: [] as string[],
    filter: undefined as string | undefined,
    code: undefined as string | undefined,
});


const table = ref<typeof CarrierShipmentTable>();

const { secondaryBg } = useColorScheme();
const { xs, md, smAndDown, smAndUp, mdAndUp } = useDisplay();


const selected = ref<string[]>([]);



function refreshTable() {
    table.value?.refresh();
}

</script>