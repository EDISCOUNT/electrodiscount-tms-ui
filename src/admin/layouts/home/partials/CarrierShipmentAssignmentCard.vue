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
                <v-slide-group v-model="model" multiple>
                    <v-slide-group-item v-for="(carrier, i) in pagination.items" :key="carrier.id">
                        <v-card :to="{ name: 'admin:carrier:shipment:index', query: {  ...(criteria?? {}), carrier: carrier.id } }"
                            :class="['ma-2',]" flat>
                            <template v-slot:prepend>
                                <slot name="prepend">
                                    <v-avatar color="white" :size="60">
                                        <v-icon size="50">mdi-truck</v-icon>
                                    </v-avatar>
                                </slot>
                            </template>
                            <template v-slot:append>
                                <v-btn variant="text" size="x-small" icon>
                                    <v-icon>mdi-arrow-right</v-icon>
                                </v-btn>
                            </template>
                            <template v-slot:title>
                                <slot name="title">
                                    <span class="text-h6">
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
                                        <v-row class="px-2">
                                            <v-col cols="3">
                                                <!-- <v-card flat> -->
                                                <CarrierShipmentStatusCount :carrier="carrier" :filter="filter"
                                                    :criteria="criteria" status="assigned" />
                                                <!-- </v-card> -->
                                            </v-col>
                                            <v-col cols="3">
                                                <!-- <v-card flat> -->
                                                <CarrierShipmentStatusCount :carrier="carrier" :filter="filter"
                                                    :criteria="criteria" status="intransit" />
                                                <!-- </v-card> -->
                                            </v-col>
                                            <v-col cols="3">
                                                <!-- <v-card flat> -->
                                                <CarrierShipmentStatusCount :carrier="carrier" :filter="filter"
                                                    :criteria="criteria" status="onhold" />
                                                <!-- </v-card> -->
                                            </v-col>
                                            <v-col cols="3">
                                                <!-- <v-card flat> -->
                                                <CarrierShipmentStatusCount :carrier="carrier" :filter="filter"
                                                    :criteria="criteria" status="delivered" />
                                                <!-- </v-card> -->
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                        </v-card>
                        <v-divider class="my-5 mx-3" v-if="pagination?.items.length != (i + 1)" vertical />
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
import { computed, ref } from 'vue';


const props = defineProps<{
    code?: string;
    filter?: string;
    criteria?: { [i: string]: any };
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


const model = ref<any>();


const theme = useTheme();
const isDark = computed(() => theme.current.value.dark);

</script>