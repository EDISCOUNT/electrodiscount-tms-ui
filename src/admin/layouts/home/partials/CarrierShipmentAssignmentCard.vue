<template>
    <v-card v-if="pagination" flat>
        <!-- <v-card-title>
            <slot name="title">
                <v-icon>mdi-truck</v-icon>
                Carrier Shipment Assignment
            </slot>
        </v-card-title> -->
        <v-card-text class="pa-0">
            <v-card r-color="secondary-bg" flat>
                <v-slide-group>
                    <v-slide-group-item v-for="(carrier, i) in pagination.items" :key="carrier.id">
                        <v-card class="ma-2" :color="isDark? /*'black'*/ 'grey-darken-4' : 'grey-lighten-5'" flat>
                            <template v-slot:prepend>
                                <slot name="prepend">
                                    <v-avatar color="white" :size="50">
                                        <v-icon size="50">mdi-truck</v-icon>
                                    </v-avatar>
                                </slot>
                            </template>
                            <template v-slot:title>
                                <slot name="title">
                                    <span class="text-h5">
                                        {{ carrier.name }}
                                    </span>
                                </slot>
                            </template>
                            <template v-slot:subtitle>
                                <slot name="subtitle">
                                    <small class="text-grey">
                                        {{ carrier.code }}
                                    </small>
                                </slot>
                            </template>
                            <v-row>
                                <!-- <v-col :cols="12" :md="12">
                                    <v-card-title>
                                        <v-list-item-title>
                                            <span class="text-h4">
                                                {{ carrier.name }}
                                            </span>
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            <span class="text-grey">
                                                {{ carrier.code }}
                                            </span>
                                        </v-list-item-subtitle>
                                    </v-card-title>
                                </v-col> -->
                                <v-col :cols="12" :md="12">
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="4">
                                                <!-- <v-card flat> -->
                                                    <CarrierShipmentStatusCount :carrier="carrier" status="assigned" />
                                                <!-- </v-card> -->
                                            </v-col>
                                            <v-col cols="4">
                                                <!-- <v-card flat> -->
                                                    <CarrierShipmentStatusCount :carrier="carrier" status="intransit" />
                                                <!-- </v-card> -->
                                            </v-col>
                                            <v-col cols="4">
                                                <!-- <v-card flat> -->
                                                    <CarrierShipmentStatusCount :carrier="carrier" status="delivered" />
                                                <!-- </v-card> -->
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                        </v-card>
                        <v-divider class="my-5 mx-3" v-if="pagination?.items.length != (i + 1)" vertical/>
                    </v-slide-group-item>
                </v-slide-group>
            </v-card>
        </v-card-text>
    </v-card>
    <v-row justify="center" align="center" class="fill-height" v-else>
        <v-progress-circular indeterminate />
    </v-row>
</template>

<script lang="ts" setup>
import { getPaginatedCarriers } from '@/admin/repository/carrier/carrier_repository';
import useSWRV from 'swrv';
import CarrierShipmentStatusCount from './CarrierShipmentStatusCount.vue';
import { useTheme } from 'vuetify';
import { computed } from 'vue';


const props = defineProps<{
    code?: string;
}>();



const { data: pagination, isValidating: loading, error } = useSWRV(
    () => `/api/admin/carrier/carriers?page=1&limit=20`,
    () => getPaginatedCarriers({
        page: 1,
        limit: 20
    }),
    {
        refreshInterval: 0,
        revalidateOnFocus: false,
        // revalidateOnReconnect: false,
    },
);


const  theme = useTheme();
const isDark = computed(() => theme.current.value.dark);

</script>