<template>
    <v-app>
        <navigation-drawer />
        <v-main>
            <v-card color="secondary-bg" height="100vh" flat>

                <v-row justify="center" align="center" class="fill-height">
                    <v-card-text>
                        <v-row>
                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="new" />
                            </v-col>

                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="assigned" />
                            </v-col>

                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="ready" />
                            </v-col>

                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="onhold" />
                            </v-col>
                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="delivered" />
                            </v-col>
                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="completed" />
                            </v-col>
                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="returned" />
                            </v-col>
                            <v-col :cols="12" :sm="6" :md="4" :lg="3">
                                <shipment-status-count status="cancelled" />
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


</script>