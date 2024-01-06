<template>
    <v-app>
        <navigation-drawer />
        <v-main>
            <v-card color="secondary-bg" :height="smAndDown ? undefined : '100vh'"
                :min-height="mdAndUp ? undefined : '100vh'" class="pa-3" flat>

                <v-row justify="center" align="center" class="fill-height">
                    <v-card-text>
                        <v-row>
                            <v-col :cols="12" :sm="12">
                                <v-card class="pa-5" flat>

                                    <template v-slot:append>
                                        <v-btn :to="{name: 'admin:shipment:index'}" variant="text" icon>
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

                            <v-col :cols="12" :sm="6">
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

                            <v-col :cols="12" :sm="6">
                                <v-card class="fill-height" width="100%" flat>
                                    <carrier-shipment-assignment-card/>
                                </v-card>
                            </v-col>
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
// import 


const { user } = useUser();
const { xs, smAndDown, mdAndUp, sm } = useDisplay();


</script>