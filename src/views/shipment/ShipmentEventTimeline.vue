<template>
    <v-card flat>
        <template v-if="pagination">
            <v-card-text v-if="error">
                <v-alert type="error">
                    {{ error }}
                </v-alert>
            </v-card-text>
            <v-card-text>
                <v-card :max-height="maxHeight ?? '600px'" style="overflow-y: auto;" flat>
                    <v-timeline density="compact" truncate-line="both">
                        <v-timeline-item v-for="(event, i) in pagination.items" :key="event.id ?? i" :size="10"
                            style="padding: 0;">
                            <!-- <template v-if="event.createdAt" v-slot:opposite>
                            <v-chip variant="text">
                                <span class="text-grey">
                                    {{ formatDate(event.createdAt) }}
                                </span>
                            </v-chip>
                        </template> -->
                            <v-card flat>
                                <!-- <v-spacer/> -->
                                <!-- <v-toolbar/> -->
                                <!-- <template v-slot:title>
                                <v-list-item flat> -->
                                <!-- <template v-slot:title> -->
                                <v-card-subtitle v-if="event.eventOccuredAt">
                                    <span class="text-grey">
                                        {{ formatDate(event.eventOccuredAt) }}
                                    </span>
                                </v-card-subtitle>

                                <v-card-title>
                                    {{ event.title }}
                                </v-card-title>
                                <!-- </template> -->
                                <!-- <template v-if="event.eventOccuredAt" v-slot:subtitle> -->

                                <!-- </template> -->
                                <v-card-text>
                                    {{ event.subtitle }}
                                </v-card-text>
                                <!-- </template> -->
                                <!-- </v-list-item> -->
                                <!-- </template> -->
                                <v-card-text class="pa-2">
                                    <!-- {{ { attachments: event.attachments } }} -->
                                    <v-row justify="start" class="py-5">
                                        <v-col :cols="6" v-for="(attachment, i) in event.attachments" :key="attachment.id">
                                           <shipment-event-timeline-item :attachment="attachment"/>
                                        </v-col>
                                    </v-row>

                                </v-card-text>
                            </v-card>
                        </v-timeline-item>
                    </v-timeline>
                </v-card>
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
import { formatDate } from '@/utils/format';
import useSWRV from 'swrv';
import Pagination from '@/data/pagination/pagination';
import ShipmentEvent from '@/model/shipment/shipment_event';
import ShipmentEventTimelineItem from './ShipmentEventTimelineItem.vue';

interface FetchShipmentEventsParams {
    shipment: Shipment
    page?: number
    limit?: number
}

const props = defineProps<{
    shipment: Shipment;
    maxHeight?: string | number;
    getPaginatedShipmentEvents(input: FetchShipmentEventsParams): Promise<Pagination<ShipmentEvent>>
}>();

const { data: pagination, isValidating: loading, error } = useSWRV(
    () => `/api/shipment/shipments/${props.shipment.id!}/events`,
    () => props.getPaginatedShipmentEvents({ shipment: props.shipment, limit: 50 }),
)

</script>