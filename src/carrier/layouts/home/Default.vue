<template>
    <v-app>
        <navigation-drawer />
        <v-main>
            <v-card color="secondary-bg" height="100vh" flat>

                <v-row justify="center" align="center" class="fill-height">
                    <v-card-text>
                        <v-row>
                            <v-col :cols="12" :sm="12">
                                <v-card class="pa-5" flat>
                                    <template v-slot:append>
                                        <v-btn :to="{ name: 'carrier:shipment:index' }" variant="text" icon>
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
                                            Welcome to the carrier panel</span>
                                    </template>
                                    <!-- </v-card-title> -->
                                    <v-card-subtitle>
                                        <span class="text-h5">Manage your shipments, documents, email templates and
                                            more</span>
                                    </v-card-subtitle>
                                    <!-- </v-col> -->
                                    <!-- <v-col :cols="12" :sm="6"> -->
                                    <!-- <v-img src="/images/undraw_carrier.svg" /> -->
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
                                                <!-- {{ {dateCriteria} }} -->
                                                <ShipmentTimeRangeOptionInput v-model:criteria="dateCriteria"
                                                    v-model:rsql="parameters.dateRsql" />
                                            </div>
                                            <!-- </v-col> -->
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>


                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="new" :filter="filter" :criteria="criteria" />
                            </v-col>

                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="assigned" :filter="filter" :criteria="criteria" />
                            </v-col>

                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="ready" :filter="filter" :criteria="criteria" />
                            </v-col>

                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="onhold" :filter="filter" :criteria="criteria" />
                            </v-col>
                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="delivered" :filter="filter" :criteria="criteria" />
                            </v-col>
                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="completed" :filter="filter" :criteria="criteria" />
                            </v-col>
                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="returned" :filter="filter" :criteria="criteria" />
                            </v-col>
                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="cancelled" :filter="filter" :criteria="criteria" />
                            </v-col>

                        </v-row>
                    </v-card-text>
                </v-row>
                <!-- <v-row justify="center" align="center" class="fill-height">
                    <v-card width="400px" flat>
                        <v-card-title>Home</v-card-title>
                        <v-card-subtitle>
                            Welcome to the carrier panel
                        </v-card-subtitle>
                    </v-card>

                </v-row> -->

                <!-- <v-card-text>
                    <v-row>
                        <v-col :cols="12" :md="4">
                            <EntityPageCount url="/api/carrier/channel/channels"
                                :fetcher="() => getPaginatedCarriers({ limit: 0 })" />
                        </v-col>
                        <v-col :cols="12" :md="4">
                            <EntityPageCount url="/api/carrier/shipment/shipment"
                                :fetcher="getPaginatedChannels({ limit: 0 })" />
                        </v-col>
                        <v-col :cols="12" :md="4">
                            <EntityPageCount url="/api/carrier/catalog/products"
                                :fetcher="getPaginatedProducts({ limit: 0 })" />
                        </v-col>
                    </v-row>
                </v-card-text> -->
            </v-card>
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
import NavigationDrawer from '@/carrier/components/NavigationDrawer.vue';
import EntityPageCount from './partials/EntityPageCount.vue';
// import { getPaginatedCarriers } from '@/carrier/repository/carrier/carrier_repository';
// import { getPaginatedChannels } from '@/carrier/repository/channel/channel_repository';
// import { getPaginatedProducts } from '@/carrier/repository/catalog/product_repository';
import ShipmentStatusCount from './partials/ShipmentStatusCount.vue';
import ShipmentTimeRangeOptionInput from './partials/ShipmentTimeRangeOptionInput.vue';
import { useUser } from '@/store/app';
import { Comparison, and, comparison, inList } from 'rsql-builder';
import { useDisplay } from 'vuetify';
import { reactive, ref, computed } from 'vue';
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