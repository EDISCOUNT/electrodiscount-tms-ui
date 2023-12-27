<template>
    <v-card flat>
        <template v-if="pagination">
            <v-card-text v-if="error">
                <v-alert type="error">
                    {{ error }}
                </v-alert>
            </v-card-text>
            <v-card-text>
                <v-timeline density="comfortable">
                    <v-timeline-item v-for="(event, i) in pagination.items" :key="event.id ?? i" :size="10">
                        <template v-slot:opposite>
                            <span class="text-grey">
                                {{ formatDate(event.createdAt) }}
                            </span>
                        </template>
                        <v-list-item flat>
                            <template v-slot:title>
                                {{ event.title }}
                            </template>
                            <template v-slot:subtitle>
                                {{ event.subtitle }}
                            </template>
                        </v-list-item>
                    </v-timeline-item>
                </v-timeline>
            </v-card-text>
        </template>
        <v-card flat v-else-if="loading">
            <v-card-subtitle>
                Please wait...
            </v-card-subtitle>
            <v-card-text>
                <v-progress-linear indeterminate />
            </v-card-text>
        </v-card>
        <v-card flat v-else>
            <template v-slot:title>
                <span>Seems an error occured</span>
            </template>
            <v-card-text v-if="error">
                <v-alert type="error">
                    {{ error }}
                </v-alert>
            </v-card-text>
        </v-card>
    </v-card>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import { getPaginatedShipmentEvents } from '@/admin/repository/shipment/shipment_event_repository';
import {formatDate} from '@/utils/format';
import useSWRV from 'swrv';

const props = defineProps<{
    shipment: Shipment
}>();

const { data: pagination, isValidating: loading, error } = useSWRV(
    () => `/api/admin/shipment/shipments/${props.shipment.id!}/events`,
    () => getPaginatedShipmentEvents({shipment: props.shipment}),
)

</script>