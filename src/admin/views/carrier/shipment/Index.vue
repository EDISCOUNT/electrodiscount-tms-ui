<template>
    <v-card height="100vh" style="overflow-y: auto;" :color="secondaryBg" flat>
        <!-- {{ {tab} }} -->
        <v-card-text class="pa-0 pa-sm-4">
            <v-card flat>
                <v-tabs v-if="pagination" v-model="tab" r-bg-color="primary" align-tabs="start" mobile-breakpoint="xs">
                    <v-tab v-for="(carrier) in pagination.items" :key="carrier.id" :value="carrier.id"
                        r-:to="{ name: 'admin:carrier:shipment:index', params: { id: carrier.id } }">
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-avatar color="primary">
                                    <v-img v-if="carrier.logoImage" :src="carrier.logoImage.url" />
                                    <span v-else class="text-h5">
                                        {{ carrier.name.trim().slice(0, 1).toUpperCase() }}
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
            </v-card>
            <!-- {{ {filter} }} -->
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
                        </v-row>
                        <v-card-text v-else class="py-0">
                            <v-row class="pa-3" justify="space-between">
                                <ShipmentStatusFilter v-if="mdAndUp" v-model="filter.status" :filter="tableFilter.filter"
                                    url="/api/admin/shipment/shipments/count"
                                    :counter="({ status, filter }) => countShipments({ criteria: { status, filter } })"
                                    update-url-query multiple />
                                <ShipmentFilterBar v-model:rsql="filter.filter"  v-model:filter="criteria" :code="filter.code"
                                    r-:status="filter.status" update-url-query no-carrier v-else />
                                <BarcodeScannerButton v-model:result="filter.code" autoclose />
                            </v-row>
                        </v-card-text>
                    </v-toolbar>
                </template>
                <!-- <template v-slot:title> -->
                <!-- <div class="mt-2"> -->
                <!-- <v-toolbar-items> -->
                <ShipmentFilterBar v-if="mdAndUp" v-model:rsql="filter.filter" v-model:filter="criteria" r-:status="filter.status" no-carrier
                    update-url-query class="mt-2 px-5" />
                <!-- </v-toolbar-items> -->
                <!-- </div> -->
                <!-- </template> -->

                <template v-slot:append>
                    <create-shipment-button />
                </template>
            </v-card>



            <v-card class="mt-4 fill-height" flat>
                <v-card-text class="pb-0">
                    <v-window v-if="pagination" v-model="tab" :touch="false">
                        <v-window-item v-for="(carrier) in pagination.items" :key="carrier.id" :value="carrier.id">
                            <!-- {{ { tableFilter } }} -->
                            <shipment-table v-model="selected" :filter="{ ...(tableFilter ?? {}), ...(criteria ?? {}) }" ref="table"
                                height="calc(100vh - 380px)" show-select />
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </v-card>

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import useSWRV from 'swrv';
import ShipmentTable from '@/admin/views/shipment/shipment/partials/ShipmentTable.vue';
import { getPaginatedCarriers } from '../../../repository/carrier/carrier_repository';
// 

import CreateShipmentButton from '@/admin/views/shipment/shipment/partials/CreateShipmentButton.vue';
import ShipmentStatusFilter from '@/views/shipment/filter/ShipmentStatusFilter.vue';
// import { reactive } from 'vue';
import PrintShipmentManifestButton from '@/admin/views/shipment/shipment/partials/PrintShipmentManifestButton.vue';
import ExportShipmentButton from '@/admin/views/shipment/shipment/partials/ExportShipmentButton.vue';
import ShipmentFilterBar from '@/admin/views/shipment/shipment/partials/filtter/ShipmentFilterBar.vue';
import { useColorScheme } from '@/utils/color';
import { useDisplay } from 'vuetify';
import BarcodeScannerButton from '@/components/BarcodeScannerButton.vue';
import BulkUpdateShipmentStatusButton from '@/views/shipment/BulkUpdateShipmentStatusButton.vue';
import { bulkApplyTransition } from '@/admin/repository/shipment/shipment_repository';
import { ref, watch, reactive, computed, onMounted } from 'vue';
import { and, eq, comparison, Comparison } from 'rsql-builder';
import { countShipments } from '@/admin/repository/shipment/shipment_repository';
import { useRouter } from 'vue-router';

const filter = reactive({
    status: [] as string[],
    filter: undefined as string | undefined,
    code: undefined as string | undefined,
});

const { data: pagination, isValidating: loading, error } = useSWRV(
    `/api/admin/carrier/carriers`,
    () => getPaginatedCarriers({ limit: 100, page: 1, criteria: { enabled: true }, sortBy: { name: 'asc' } }),
);
const router = useRouter();


const table = ref<typeof ShipmentTable>();

const { secondaryBg } = useColorScheme();
const { xs, md, smAndDown, smAndUp, mdAndUp } = useDisplay();


const tab = ref<number>();
const selected = ref<string[]>([]);
const criteria = ref<{ [i: string]: any }>();


watch(tab, (carrier) => {
    router.replace({
        query: {
            ...router.currentRoute.value.query,
            carrier
        }
    })
});

onMounted(() => {
    const query = router.currentRoute.value.query;
    if (query) {
        try {
            setTimeout(() => {
                console.log("QUERY IN: ", { query, tab: tab.value });
                let carrier = query.carrier as (string | string[]);
                if (carrier) {
                    if (Array.isArray(carrier)) {
                        carrier = carrier[0] ?? undefined;
                    }
                    tab.value = carrier ? Number(carrier) : carrier as any;
                }
                console.log("QUERY OUT: ", { query, tab: tab.value });
                // tab.value = (query.carrier as any) ?? [];
            }, 0);
        } catch (e) {

        }
    };
});


const tableFilter = computed(() => {

    let _filter: Comparison | string | undefined;// = filter.filter;
    if (tab.value) {
        _filter = comparison('carrier.id', eq(tab.value));

        if (filter.filter) {
            _filter = and(
                filter.filter,
                _filter);
        }
        else {
        }
        // _filter = _filter.toString();
    }



    // console.log("FILTER: ", { _filter });

    return {
        ...filter,
        filter: _filter?.toString()
    };
});



function refreshTable() {
    table.value?.refresh();
}
</script>