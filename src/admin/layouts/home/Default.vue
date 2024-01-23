<template>
    <v-app>
        <navigation-drawer />
        <v-main>
            <v-card color="secondary-bg" :height="smAndDown ? undefined : '100vh'"
                :min-height="mdAndUp ? undefined : '100vh'" class="pa-3" style="overflow-y: auto;" flat>

                <v-row justify="center" align="center" class="fill-height">
                    <v-card color="transparent" flat>
                        <!-- <v-card-title class="mb-3">
                   
                        </v-card-title> -->
                        <!-- {{ {criteria,} }} -->
                        <!-- {{ { criteria, dType: typeof (criteria?.dateRange) } }} -->
                        <v-card-text class="">
                            <v-row>
                                <v-col :cols="12" :sm="12">
                                    <v-card class="pa-5" flat>
                                        <template v-slot:append>
                                            <v-btn :to="{ name: 'admin:shipment:index' }" variant="text" icon>
                                                <v-icon size="large">mdi-arrow-right</v-icon>
                                            </v-btn>
                                        </template>
                                        <!-- <v-card-text> -->
                                        <!-- <v-row> -->
                                        <!-- <v-col :cols="12" :sm="6"> -->
                                        <!-- <v-card-title> -->
                                        <template v-slot:title>
                                            <span class="text-h4">
                                                <strong v-if="user">
                                                    Hello {{ user.firstName ?? user.lastName }}!
                                                </strong>
                                                Welcome to the admin panel</span>
                                        </template>
                                        <!-- </v-card-title> -->
                                        <v-card-subtitle>
                                            <span class="text-h5">Manage your shipments, carriers, channels, orders and
                                                more</span>
                                        </v-card-subtitle>
                                        <!-- </v-col> -->
                                        <!-- <v-col :cols="12" :sm="6"> -->
                                        <!-- <v-img src="/images/undraw_admin.svg" /> -->
                                        <!-- </v-col> -->
                                        <!-- </v-row> -->
                                        <!-- </v-card-text> -->
                                    </v-card>
                                </v-col>


                                <v-col :cols="12" :sm="12">
                                    <v-card flat>
                                        <v-card-text>
                                            <v-row justify="space-between" class="px-5 pb-1 pt-4">
                                                <!-- <v-col> -->
                                                <v-chip-group v-model="parameters.fulfilmentType" variant="text" multiple>
                                                    <v-chip value="PICKUP_AND_DELIVERY">
                                                        Pick/Drop
                                                    </v-chip>

                                                    <v-chip value="DROPSHIPPING">
                                                        Drop Ship
                                                    </v-chip>

                                                    <v-chip value="RETURN_ORDER">
                                                        Return
                                                    </v-chip>

                                                    <v-chip value="EXCHANGE_ORDER">
                                                        Exchange
                                                    </v-chip>
                                                </v-chip-group>
                                                <!-- </v-col> -->
                                                <!-- <v-col> -->
                                                <v-spacer />
                                                <!-- </v-col> -->
                                                <!-- <v-col> -->
                                                <div>
                                                    <!-- {{ {criteria} }} -->
                                                    <!-- <v-chip class="mx-1">
                                                        Expected:
                                                        <v-icon>mdi-chevron-down</v-icon>
                                                    </v-chip>
                                                    <v-chip class="mx-1">
                                                        Delivered:
                                                        <v-icon>mdi-chevron-down</v-icon>
                                                    </v-chip> -->
                                                    <!-- <ShipmentTimeRangeInput/> -->
                                                    <!-- {{ {filter} }} -->
                                                    <ShipmentTimeRangeOptionInput v-model:criteria="dateCriteria"
                                                        v-model:rsql="parameters.dateRsql" />
                                                </div>
                                                <!-- </v-col> -->
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-col>

                                <v-col :cols="12" :sm="12">
                                    <v-card flat>
                                        <template v-slot:title>
                                            <span>Search Shipment</span>
                                        </template>
                                        <template v-slot:subtitle>
                                            <span>Search Shipment by channel Order Id or shipment code</span>
                                        </template>
                                        <v-card-text>
                                            <shipment-input variant="outlined" density="compact" />
                                        </v-card-text>
                                    </v-card>
                                </v-col>

                                <v-col :cols="12" :sm="12">
                                    <v-card class="fill-height" width="100%" min-height="100px" flat>
                                        <carrier-shipment-assignment-card :filter="filter" :criteria="criteria" />
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-text class="pa-0">
                            <v-card color="transparent" flat>

                                <v-card-text class="pt-2">
                                    <v-row>
                                        <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                            <shipment-status-count status="new" :filter="filter" :criteria="criteria" />
                                        </v-col>

                                        <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                            <shipment-status-count status="assigned" :filter="filter"
                                                :criteria="criteria" />
                                        </v-col>

                                        <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                            <shipment-status-count status="intransit" :filter="filter"
                                                :criteria="criteria" />
                                        </v-col>

                                        <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                            <shipment-status-count status="onhold" :filter="filter" :criteria="criteria" />
                                        </v-col>
                                        <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                            <shipment-status-count status="delivered" :filter="filter"
                                                :criteria="criteria" />
                                        </v-col>
                                        <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                            <shipment-status-count status="completed" :filter="filter"
                                                :criteria="criteria" />
                                        </v-col>
                                        <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                            <shipment-status-count status="returned" :filter="filter"
                                                :criteria="criteria" />
                                        </v-col>
                                        <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                            <shipment-status-count status="cancelled" :filter="filter"
                                                :criteria="criteria" />
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-card-text>
                    </v-card>
                </v-row>
                <!-- <v-row justify="center" align="center" class="fill-height">
                    <v-card width="400px" flat>
                        <v-card-title>Home</v-card-title>
                        <v-card-subtitle>
                            Welcome to the admin panel
                        </v-card-subtitle>
                    </v-card>

                </v-row> -->

                <!-- <v-card-text>
                    <v-row>
                        <v-col :cols="12" :md="4">
                            <EntityPageCount url="/api/admin/channel/channels"
                                :fetcher="() => getPaginatedCarriers({ limit: 0 })" />
                        </v-col>
                        <v-col :cols="12" :md="4">
                            <EntityPageCount url="/api/admin/shipment/shipment"
                                :fetcher="getPaginatedChannels({ limit: 0 })" />
                        </v-col>
                        <v-col :cols="12" :md="4">
                            <EntityPageCount url="/api/admin/catalog/products"
                                :fetcher="getPaginatedProducts({ limit: 0 })" />
                        </v-col>
                    </v-row>
                </v-card-text> -->
            </v-card>
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
import NavigationDrawer from '@/admin/components/NavigationDrawer.vue';
import EntityPageCount from './partials/EntityPageCount.vue';
import { getPaginatedCarriers } from '@/admin/repository/carrier/carrier_repository';
import { getPaginatedChannels } from '@/admin/repository/channel/channel_repository';
import { getPaginatedProducts } from '@/admin/repository/catalog/product_repository';
import ShipmentStatusCount from './partials/ShipmentStatusCount.vue';
import ShipmentInput from './partials/ShipmentInput.vue';
import { useDisplay } from 'vuetify';
import { useUser } from '@/store/app';
import CarrierShipmentAssignmentCard from './partials/CarrierShipmentAssignmentCard.vue';
import ShipmentTimeRangeInput from './partials/ShipmentTimeRangeInput.vue';
import ShipmentTimeRangeOptionInput from './partials/ShipmentTimeRangeOptionInput.vue';
import { reactive, ref } from 'vue';
import { computed } from 'vue';
import { Comparison, and, comparison, inList } from 'rsql-builder';
// import 

interface FilterConfig {
    fulfilmentType?: string[];
    dateRsql?: string;
}

const { user } = useUser();
const { xs, smAndDown, mdAndUp, sm } = useDisplay();


const parameters = reactive<FilterConfig>({});


const dateCriteria = ref<any>();
// const Criteria = ref<any>();
const criteria = computed(() => {
    return {
        fulfilmentType: parameters.fulfilmentType,
        ...(dateCriteria?.value ?? {})
    }
});

const filter = computed(() => {
    const predicates: (Comparison | string)[] = [];

    if (parameters.fulfilmentType && parameters.fulfilmentType.length > 0) {
        const predicate = comparison('fulfilmentType', inList(...parameters.fulfilmentType));
        predicates.push(predicate);
    }
    if (parameters.dateRsql) {
        predicates.push(parameters.dateRsql);
        // const predicate = and(parameters.dateRsql);
    }
    return and(...predicates);
});


</script>