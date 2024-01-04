<template>
    <!-- {{ {filter, } }} -->
    <v-data-table-server v-model="selected" v-model:items-per-page="itemsPerPage" :headers="headers"
        :items-length="totalItems" :items="serverItems" :loading="loading" :search="search" item-value="id" :height="height"
        @update:options="loadItems" :show-select="showSelect" fixed-header>


        <template v-slot:item.items="{ item: { items } }">
            <template v-if="items">
                <div v-for="(item, i) in items" :key="item.product?.gtn ?? i">
                    <div v-if="i == 0">
                        <span v-if="item?.product">
                            {{ item.product.name ?? 'UN NAMED' }}
                        </span>
                        <span v-else-if="item.name">
                            {{ item.name }}
                        </span>
                        <span class="text-grey" v-else>
                            [PRODUCT NAME NOT AVAILABE]
                        </span>
                    </div>
                    <v-chip v-else-if="i == (items.length - 1)">
                        {{ items.length - 1 }} More
                    </v-chip>
                </div>
            </template>
            <span v-else class="text-grey">N/A</span>
        </template>


        <template v-slot:item.expiresAt="{ item: { fulfilments } }">
            <!-- {{ {fulfilments} }} -->
            <template v-if="fulfilments?.length">
                <template v-for="(fulfilment, i) in fulfilments" :key="fulfilment.id ?? i">
                    <div v-if="i == 0">
                        <v-menu width="700px">
                            <template v-slot:activator="{ props }">
                                <v-chip v-bind="props" variant="text">
                                    <span v-if="fulfilment.exactDeliveryDate">
                                        {{ formatDate(fulfilment.exactDeliveryDate) }}
                                    </span>
                                    <span v-else-if="fulfilment.latestDeliveryDate">
                                        <span class="text-red text-h5">!</span>
                                        {{ formatDate(fulfilment.latestDeliveryDate) }}
                                    </span>
                                    <span class="text-grey" v-else>
                                        N/A
                                    </span>
                                    <v-icon>mdi-menu-down</v-icon>
                                </v-chip>
                            </template>
                            <v-card flat>
                                <template v-slot:title>
                                    <span>Fulfilment</span>
                                </template>
                                <v-card-text>
                                    <ShipmentFulfilmentCard :fulfilment="fulfilment" />
                                </v-card-text>
                            </v-card>

                        </v-menu>
                    </div>
                    <v-chip v-else-if="i == (fulfilments.length - 1)" size="x-small">
                        {{ fulfilments.length - 1 }} More
                    </v-chip>
                </template>
            </template>
            <span v-else class="text-grey">N/A</span>
        </template>


        <template v-slot:item.status="{ item: { status } }">
            <div v-if="status">
                <v-chip :color="getStatusColor(status)">
                    {{ status }}
                </v-chip>
            </div>
            <span class="text-grey" v-else>
                N/A
            </span>
        </template>


        <template v-slot:item.destinationAddress="{ item: { destinationAddress } }">
            <div v-if="destinationAddress">
                {{ destinationAddress.label }}
            </div>
            <span class="text-grey" v-else>
                N/A
            </span>
        </template>

        <template v-slot:item.channel="{ item: { channel } }">
            <div v-if="channel">
                {{ channel.name }}
            </div>
            <span class="text-grey" v-else>
                N/A
            </span>
        </template>

        <template v-slot:item.carrier="{ item: { carrier } }">
            <!-- {{ {carrier} }} -->
            <div v-if="carrier">
                {{ carrier.name }}
            </div>
            <span class="text-grey" v-else>
                N/A
            </span>
        </template>

        <template v-slot:item.fulfilmentType="{ item: { fulfilmentType } }">
            <small>{{fulfilmentType}}</small>
        </template>

        <template v-slot:item.actions="{ item: { id } }">
            <v-btn color="primary" :to="{ name: 'admin:shipment:show', params: { id } }" :disabled="loading" :elevation="0"
                variant="flat" size="small" rounded>
                View
                <v-icon>mdi-eye</v-icon>
            </v-btn>
        </template>
    </v-data-table-server>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { getPaginatedShipments } from '../../../../repository/shipment/shipment_repository';
import { useDisplay } from 'vuetify';
import { computed } from 'vue';
import { getStatusColor } from '@/utils/color';
import { formatDate } from '@/utils/format';
import ShipmentFulfilmentCard from '@/views/shipment/ShipmentFulfilmentCard.vue';


const props = defineProps<{
    height?: number | string;
    showSelect?: boolean;
    modelValue?: string[];
    filter?: { [i: string]: any };

}>();

const emit = defineEmits<{
    (e: 'update:model-value', selected: string[]): void;
}>();



const { xs, smAndDown, sm, lg } = useDisplay();

const height = computed(() => {

    if (props.height) {
        return props.height;
    }

    if (xs.value) {
        return 'calc(100vh - 210px)';
    }
    return 'calc(100vh - 290px)'
})

const headers = [
    {
        title: 'ID',
        // align: 'start',
        // sortable: false,
        key: 'id',
    },
    // {
    //     title: 'Code', key: 'code',
    //     //  align: 'end' 
    // },
    {
        title: 'Order ID', key: 'channelOrderId',
        //  align: 'end' 
    },
    {
        title: 'Products', key: 'items',
        //  align: 'center' 
    },
    {
        title: 'Destination', key: 'destinationAddress',
        //  align: 'center' 
    },
    {
        title: 'Carrier', key: 'carrier',
        // align: 'center' 
    },
    {
        title: 'Channel', key: 'channel',
        // align: 'center' 
    },
    { title: 'Delivery Date', key: 'expiresAt', },
    {
        title: 'Status', key: 'status',
        //  align: 'center'
    },
    // {
    //     title: 'Status', key: 'status',
    //     //  align: 'center'
    // },
    {
        title: 'Fulfilment Type', key: 'fulfilmentType',
        // align: 'center'
    },
    {
        title: 'Actions', key: 'actions',
        //  align: 'end' 
    },
];


const itemsPerPage = ref(10);
const search = ref('');
const serverItems = ref<any[]>([]);
const loading = ref(true);
const totalItems = ref(0);
const tablePage = ref(1);
const selected = ref<string[]>(props.modelValue ?? []);


watch(() => props.modelValue, (value) => selected.value = value ?? []);
watch(selected, (selected) => emit('update:model-value', selected));



watch(
    () => props.filter,
    (filter) => {
        // console.log("DATA CHANGED:", filter);
        loadItems({
            page: tablePage.value,
            itemsPerPage: itemsPerPage.value,
            // sortBy: sortBy.value,
            sortBy: {},
            filter: filter,
        })
    }, { deep: true });


async function loadItems({ page, itemsPerPage: limit, sortBy, filter }: { page?: number, itemsPerPage?: number, sortBy?: any, filter?: { [i: string]: any } }) {
    try {
        console.log("SORT BY: ", { sortBy });
        const criteria = {
            ...(filter ?? props.filter ?? {}),
        };

        loading.value = true;
        const pagination = await getPaginatedShipments({ page, limit, criteria });
        tablePage.value = page ?? 1;
        serverItems.value = [...pagination.items];
        totalItems.value = pagination.pageInfo.totalItems;
        itemsPerPage.value = pagination.pageInfo.perPage;

    }
    catch (err) {
        throw err;
    }
    finally {
        loading.value = false;
    }
}



async function refresh() {
    await loadItems({});
}


defineExpose({
    refresh,
})
</script>