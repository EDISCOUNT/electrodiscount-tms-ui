<template>
    <div>
        <!-- <DateRangeSelector/> -->
        <!-- {{ { rsql: filter.fulfilmentDatesRsql } }} -->
        <!-- {{ {updateUrlQuery: props.updateUrlQuery, seen: true} }} -->
        <v-row no-gutters>
            <v-col :cols="12" :sm="3" r-:md="4" r-:lg="3">
                <ShipmentFulfilmentDateRangeFilter v-model="filter.fulfilmentDateRange"
                    v-model:rsql="filter.fulfilmentDatesRsql" label="Expected Delivery Dates"
                    placeholder="Select fulfilment dates" variant="outlined" density="compact"
                    r-:fields="['fulfilment.exactDeliveryDate']" :possible-fields="[
                        { label: 'Exact Delivery Date', value: 'fulfilment.latestDeliveryDate' },
                        { label: 'Latest Delivery Date', value: 'fulfilment.exactDeliveryDate', },
                        { label: 'Expiry Date', value: 'fulfilment.expiryDate' }
                    ]" filter-main filter-items allow-select-fields multiple clearable />
            </v-col>
            <v-col :cols="12" :sm="3" r-:md="4" r-:lg="3">
                <ShipmentFulfilmentDateRangeFilter v-model="filter.dateRange" r-v-model:rsql="filter.dateRangeRsql"
                    r-label="Delivery Dates" placeholder="Select date range" variant="outlined"
                    r-:possible-fields="[{ label: 'Delivery Date', value: 'deliveryDate' }]" r-:fields="['deliveredAt']"
                    filter-main density="compact" multiple clearable />
            </v-col>
            <!-- <v-col :cols="12" :sm="3" r-:md="4" r-:lg="3">
                <v-text-field v-model="filter.code" label="Shipment Code" placeholder="Enter Shipment Code"
                    variant="outlined" density="compact" class="mr-2" clearable />
            </v-col> -->
            <v-col :cols="12" :sm="3" r-:md="4" r-:lg="3">
                <v-text-field v-model="filter.channelOrderId" label="Order ID" placeholder="Enter Order Id"
                    variant="outlined" density="compact" class="mx-1" clearable />
            </v-col>
            <v-col :cols="12" :sm="3" r-:md="4" r-:lg="3">
                <v-select v-model="filter.fulfilmentType" label="Fulfilment Type" variant="outlined" density="compact"
                        class="mx-1" :items="[
                            'PICKUP_AND_DELIVERY',
                            'DROPSHIPPING',
                            'RETURN_ORDER',
                            'EXCHANGE_ORDER',
                            'REPAIR_ORDER',
                        ]" clearable multiple>
                        <template v-slot:selection="{ item, index, }">
                            <template v-if="index == 0">
                                {{ item?.raw }}
                            </template>
                            <template v-else-if="index == ((filter.fulfilmentType?.length ?? 0) - 1)">
                                <v-chip size="small">
                                    +{{ (filter.fulfilmentType!.length ?? 0) - 1 }} more
                                </v-chip>
                            </template>
                        </template>
                    </v-select>
            </v-col>
            <!-- <v-col :cols="12" :sm="4" r-:md="4" r-v-if="!noCarrier" r-:lg="3">
                <CarrierInput v-model="filter.carrier" label="Carriers" placeholder="Filter by assigned carriers"
                    variant="outlined" density="compact" class="mx-1" :disabled="noCarrier" multiple clearable />
            </v-col> -->
            <!-- <v-col :cols="12" :sm="3" r-:md="4" r-:lg="3">
                <ChannelInput v-model="filter.channel" label="Channels" placeholder="Filter by source Channels"
                    variant="outlined" density="compact" class="mx-1" multiple clearable />
            </v-col> -->

            <v-col v-if="xs" :cols="12" :sm="3" r-:md="4" r-:lg="3">
                <ShipmentStatusFilter v-model="filter.status" url="/api/carrier/shipment/shipments/count"
                    :counter="({ status, filter }) => countShipments({ criteria: { status, filter } })" />
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
import { countShipments } from '@/carrier/repository/shipment/shipment_repository';
import { debounce } from 'lodash';

interface FilterOptions {
    // channel: string[];
    // carrier: string[];
    code?: string,
    channelOrderId?: string;
    status?: string | string[];
    fulfilmentDateRange?: DateRangeInput;
    dateRange?: DateRangeInput;
    fulfilmentDatesRsql?: string;
    fulfilmentType?: string[];
    dateRangeRsql?: string;
}

const props = defineProps<{
    code?: string;
    status?: string | string[];
    filter?: { [i: string]: any };
    updateUrlQuery?: boolean;
    // urlQueryNamespace?: string | symbol;
    noCarrier?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:rsql', value?: string): void;
    (e: 'update:filter', value?: { [i: string]: any }): void;
}>();

const router = useRouter();
const { xs, sm, lg } = useDisplay();

const filter = reactive<FilterOptions>({
    // carrier: [],
    // channel: [],
    // status: 
});



watch(filter, (filter) => {
    if (props.updateUrlQuery) {
        updateUrlQuery();
    }
}, { deep: true });

onMounted(() => {
    if (props.updateUrlQuery) {
        const query = router.currentRoute.value.query;
        if (query) {
            try {
                console.log("QUERY: ", { query });
                filter.code = query.code as string;
                filter.channelOrderId = query.channelOrderId as string;
                // filter.status = query.status as string;
                // filter.carrier = (Array.isArray(query.carrier) ? query.carrier : [query.carrier].filter((e: any) => e)).map(e => Number(e)) as any[];
                // filter.channel = (Array.isArray(query.channel) ? query.channel : [query.channel].filter((e: any) => e)).map(e => Number(e)) as any[];
                filter.fulfilmentType = (Array.isArray(query.fulfilmentType) ? query.fulfilmentType : [query.fulfilmentType].filter((e: any) => e)) as string[];
                // filter.status = query.status as string;
                const fulfilmentDateRange = query.fulfilmentDateRange ? JSON.parse(query.fulfilmentDateRange as string) : undefined;
                const dateRange = query.dateRange ? JSON.parse(query.dateRange as string) : undefined;
                // filter.fulfilmentDatesRsql = query.fulfilmentDatesRsql as string;
                // filter.dateRangeRsql = query.dateRangeRsql as string;

                if (fulfilmentDateRange) {
                    rebuildDateRange(fulfilmentDateRange);
                    filter.fulfilmentDateRange = fulfilmentDateRange;
                }
                if (dateRange) {
                    rebuildDateRange(dateRange);
                    filter.dateRange = dateRange;
                }

                // console.log("FILTER: ", { filter });
            }
            catch (err) {
                // console.log("ERROR: ", err);

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

    // if (!(props.noCarrier) && (filter.carrier?.length ?? 0) > 0) {
    //     query = and(query, comparison('carrier.id', inList(...filter.carrier)));
    // }
    // if ((filter.channel?.length ?? 0) > 0) {
    //     query = and(query, comparison('channel.id', inList(...filter.channel)));
    // }
    if (filter.fulfilmentType && filter.fulfilmentType.length > 0) {
        query = and(query, comparison('fulfilmentType', inList(...filter.fulfilmentType)));
    }
    if (filter.fulfilmentDatesRsql) {
        query = and(query, filter.fulfilmentDatesRsql);
    }
    if (filter.dateRangeRsql) {
        query = and(query, filter.dateRangeRsql);
    }
    return query;
});


watch(rsql, (rsql) => emit('update:rsql', rsql));

// 

watch(
    () => props.filter,
    (input) => updateFilter(input),
);
watch(filter, (filter) => emit('update:filter', filter));




let updating_filter = false;
function updateFilter(input?: { [i: string]: any }) {
    if (updating_filter) {
        return;
    }
    updating_filter = true;

    input ??= {};

    for (const key in filter) {
        const value = (input as any)[key];
        (filter as any)[key] = value;
    }

    setTimeout(() => {
        updating_filter = false;
    }, 10);
}


function rebuildDateRange(range: any) {
    if (range.start) {
        range.start = new Date(range.start);
    }
    if (range.end) {
        range.end = new Date(range.end);
    }
}




function doUpdateUrlQuery() {
    router.replace({
        query: {
            ...router.currentRoute.value.query,
            // [props.urlQueryNamespace ?? 'filter']: 
            ...filter,
            ...(props.noCarrier ? { carrier: undefined } : {}),
            fulfilmentDateRange: filter.fulfilmentDateRange ? JSON.stringify(filter.fulfilmentDateRange) : undefined,
            dateRange: filter.dateRange ? JSON.stringify(filter.dateRange) : undefined,
            fulfilmentDatesRsql: undefined,
            dateRangeRsql: undefined
        }
    })
}

const updateUrlQuery = debounce(doUpdateUrlQuery, 1000);

</script>