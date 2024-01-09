<template>
    <div>
        <!-- <DateRangeSelector/> -->
        <!-- {{ { rsql: filter.datesRsql } }} -->
        <v-row no-gutters>
            <v-col :cols="12" :sm="3" r-:md="4" r-:lg="3">
                <ShipmentFulfilmentDateRangeFilter v-model="filter.fulfilmentDateRange" v-model:rsql="filter.fulfilmentDatesRsql"
                    label="Expected Delivery Dates" placeholder="Select fulfilment dates" variant="outlined"
                    density="compact" :fields="['fulfilment.exactDeliveryDate']" :possible-fields="[
                        { label: 'Exact Delivery Date', value: 'fulfilment.latestDeliveryDate' },
                        { label: 'Latest Delivery Date', value: 'fulfilment.exactDeliveryDate', },
                        { label: 'Expiry Date', value: 'fulfilment.expiryDate' }
                    ]" filter-main filter-items allow-select-fields multiple clearable />
            </v-col>
            <v-col :cols="12" :sm="3" r-:md="4" r-:lg="3">
                <ShipmentFulfilmentDateRangeFilter v-model="filter.deliveryDateRange" v-model:rsql="filter.deliveryDateRsql"
                    label="Delivery Dates" placeholder="Select fulfilment dates" variant="outlined"
                    r-:possible-fields="[{ label: 'Delivery Date', value: 'deliveryDate' }]" :fields="['deliveredAt']"
                    filter-main density="compact" multiple clearable />
            </v-col>
            <v-col :cols="12" :sm="3" r-:md="4" r-:lg="3">
                <v-text-field v-model="filter.code" label="Shipment Code" placeholder="Enter Shipment Code"
                    variant="outlined" density="compact"  class="mr-2" clearable />
            </v-col>
            <v-col :cols="12" :sm="3" r-:md="4" r-:lg="3">
                <v-text-field v-model="filter.channelOrderId" label="Order ID" placeholder="Enter Order Id"
                    variant="outlined" density="compact"  class="mx-1" clearable />
            </v-col>
            <v-col :cols="12" :sm="4" r-:md="4" r-:lg="3">
                <v-select v-model="filter.fulfilmentType" label="Fulfilment Type" variant="outlined" density="compact" class="mx-1"
                    :items="[
                        'PICKUP_AND_DELIVERY',
                        'DROPSHIPPING',
                        'RETURN_ORDER',
                        'EXCHANGE_ORDER',
                    ]" multiple></v-select>
            </v-col>
            <v-col :cols="12" :sm="4" r-:md="4" r-:lg="3">
                <CarrierInput v-model="filter.carriers" label="Carriers" placeholder="Filter by assigned carriers"
                    variant="outlined" density="compact"  class="mx-1" multiple clearable />
            </v-col>
            <v-col :cols="12" :sm="4" r-:md="4" r-:lg="3">
                <ChannelInput v-model="filter.channels" label="Channels" placeholder="Filter by source Channels"
                    variant="outlined" density="compact"  class="mx-1" multiple clearable />
            </v-col>

            <v-col v-if="xs" :cols="12" :sm="4" r-:md="4" r-:lg="3">
                <ShipmentStatusFilter v-model="filter.status" />
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import CarrierInput from '../CarrierInput.vue';
import ChannelInput from '../ChannelInput.vue';
import { computed } from 'vue';
import { and, comparison, eq, inList } from 'rsql-builder';
import { like } from '@/utils/rsql';
import { useDisplay } from 'vuetify';
import ShipmentStatusFilter from '@/views/shipment/filter/ShipmentStatusFilter.vue';
import ShipmentFulfilmentDateRangeFilter from '@/views/shipment/filter/ShipmentFulfilmentDateRangeFilter.vue';
// import ShipmentFulfilmentDateFilter from '@/views/shipment/filter/ShipmentFulfilmentDateFilter.vue';
import { useRouter } from 'vue-router';
import { DateRangeInput } from '@/views/shipment/filter/DateRange';

interface FilterOptions {
    channels: string[];
    carriers: string[];
    code?: string,
    channelOrderId?: string;
    status?: string | string[];
    fulfilmentDateRange?: DateRangeInput;
    deliveryDateRange?: DateRangeInput;
    fulfilmentDatesRsql?: string;
    fulfilmentType?: string[];
    deliveryDateRsql?: string;
}

const props = defineProps<{
    code?: string;
    status?: string | string[];
    updateUrlQuery?: boolean;
    // urlQueryNamespace?: string | symbol;
}>();

const emit = defineEmits<{
    (e: 'update:rsql', value?: string): void;
}>();

const router = useRouter();
const { xs, sm, lg } = useDisplay();

const filter = reactive<FilterOptions>({
    carriers: [],
    channels: [],
    // status: 
});



watch(filter, (filter) => {
    if (props.updateUrlQuery) {
        router.replace({
            query: {
                ...router.currentRoute.value.query,
                // [props.urlQueryNamespace ?? 'filter']: 
                ...filter,
                fulfilmentDateRange: filter.fulfilmentDateRange ? JSON.stringify(filter.fulfilmentDateRange) : undefined,
                deliveryDateRange: filter.deliveryDateRange ? JSON.stringify(filter.deliveryDateRange) : undefined,
                fulfilmentDatesRsql: undefined,
                deliveryDateRsql: undefined
            }
        })
    }
});

onMounted(() => {
    if (props.updateUrlQuery) {
        const query = router.currentRoute.value.query;
        if (query) {
            try {
                console.log("QUERY: ", { query });
                filter.code = query.code as string;
                filter.channelOrderId = query.channelOrderId as string;
                filter.status = query.status as string;
                filter.carriers = (Array.isArray(query.carriers) ? query.carriers : [query.carriers].filter((e: any) => e)).map(e => Number(e)) as any[];
                filter.channels = (Array.isArray(query.channels) ? query.channels : [query.channels].filter((e: any) => e)).map(e => Number(e)) as any[];
                filter.fulfilmentType = (Array.isArray(query.fulfilmentType) ? query.fulfilmentType : [query.fulfilmentType].filter((e: any) => e)) as string[];
                // filter.status = query.status as string;
                const fulfilmentDateRange = query.fulfilmentDateRange ? JSON.parse(query.fulfilmentDateRange as string) : undefined;
                const deliveryDateRange = query.deliveryDateRange ? JSON.parse(query.deliveryDateRange as string) : undefined;
                // filter.fulfilmentDatesRsql = query.fulfilmentDatesRsql as string;
                // filter.deliveryDateRsql = query.deliveryDateRsql as string;

                if (fulfilmentDateRange) {
                    rebuildDateRange(fulfilmentDateRange);
                    filter.fulfilmentDateRange = fulfilmentDateRange;
                }
                if (deliveryDateRange) {
                    rebuildDateRange(deliveryDateRange);
                    filter.deliveryDateRange = deliveryDateRange;
                }

                console.log("FILTER: ", { filter });
            }
            catch (err) {
                console.log("ERROR: ", err);

            }
        }
    }
});

watch(
    () => props.code,
    (code) => filter.code = code,
);
watch(
    () => props.status,
    (status) => filter.status = status,
);

onMounted(() => {
    if (props.code) {
        filter.code = props.code;
    }
    if (props.status) {
        filter.status = props.status;
    }
});

const rsql = computed(() => {
    let query = '';
    if (filter.code) {
        query = and(query, comparison('code', like(filter.code)));
    }

    if (filter.status) {
        let status = filter.status;
        if (!Array.isArray(status)) {
            status = [status];
        }
        if (status.length > 0) {
            query = and(query, comparison('status', inList(...status)));
        }
    }

    if (filter.channelOrderId) {
        query = and(query, comparison('channelOrderId', like(filter.channelOrderId)));
    }

    if (filter.carriers.length > 0) {
        query = and(query, comparison('carrier.id', inList(...filter.carriers)));
    }
    if (filter.channels.length > 0) {
        query = and(query, comparison('channel.id', inList(...filter.channels)));
    }
    if (filter.fulfilmentType && filter.fulfilmentType.length > 0) {
        query = and(query, comparison('fulfilmentType', inList(...filter.fulfilmentType)));
    }
    if (filter.fulfilmentDatesRsql) {
        query = and(query, filter.fulfilmentDatesRsql);
    }
    if (filter.deliveryDateRsql) {
        query = and(query, filter.deliveryDateRsql);
    }
    return query;
});


watch(rsql, (rsql) => emit('update:rsql', rsql));




function rebuildDateRange(range: any) {
    if (range.start) {
        range.start = new Date(range.start);
    }
    if (range.end) {
        range.end = new Date(range.end);
    }
}

</script>