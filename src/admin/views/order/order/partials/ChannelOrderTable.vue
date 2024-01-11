<template>
    <v-data-table-server v-model="selected" v-model:items-per-page="itemsPerPage" :headers="headers"
        :items-length="totalItems" :items="serverItems" :loading="loading" :search="search" item-value="channelOrderId"
        :height="height ?? 'calc(100vh - 260px)'" @update:options="loadItems" fixed-header :show-select="criteria.status == 'open' && showSelect">


        <template v-slot:top>

            <v-toolbar color="background" flat>

                <!-- <v-btn color="primary" variant="flat" :elevation="0">
                    Send to BCG Transport
                </v-btn> -->

                <v-card-actions>
                    <bulk-import-shipment-action :channel="props.channel" :orderIds="selected"
                        @imported="(data) => onImport(data)" />
                </v-card-actions>

                <v-spacer />
                <ChannelOrderFilter v-model="criteria.status" />
            </v-toolbar>
        </template>

        <template v-slot:item.shippingAddress="{ item: { shippingAddress } }">
            <template v-if="shippingAddress">
                {{ shippingAddress.label }}
            </template>
            <span v-else class="text-grey">No Type</span>
        </template>

        <template v-slot:item.total="{ item: { total } }">
            <!-- {{ {total} }} -->
            <template v-if="total">
                <strong>{{ total }}</strong>
            </template>
            <span v-else class="text-grey">N/A</span>
        </template>


        <template v-slot:item.status="{ item: { status, items } }">
            <template v-if="status">
                <v-chip size="small" :color="getStatusColor(status)">
                    {{ status }}
                </v-chip>
            </template>
            <span v-else-if="items">
                <v-chip size="small" :color="getStatusColor(items[0].status)">
                    {{ items[0].status }}
                </v-chip>
            </span>
            <span v-else class="text-grey">N/A</span>
        </template>

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
                            N/A
                        </span>
                    </div>
                    <v-chip v-else-if="i == (items.length - 1)" size="x-small">
                       + {{ items.length - 1 }} More
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
                            <template v-slot:activator="{props}">
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
                                <ShipmentFulfilmentCard :fulfilment="fulfilment"/>
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



        <template v-slot:item.createdAt="{ item: { channelOrderCreatedAt: createdAt, items } }">
            <template v-if="createdAt">
                <span> {{ formatDate(createdAt) }} </span>
            </template>
            <span v-else class="text-grey">N/A</span>
        </template>




        <template v-slot:item.actions="{ item }">
            <!-- <v-btn color="primary" :to="{ name: 'admin:order:edit', params: { id: item.id } }">
                <v-icon>mdi-pencil</v-icon>
            </v-btn> -->
            <v-btn @click="() => previewOrder(item)" color="primary" :elevation="0" variant="flat" size="x-small">
                More
                <v-icon>mdi-eye</v-icon>
            </v-btn>

            <!-- <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" :elevation="0">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-card flat>
                    <v-card-text>

                    </v-card-text>
                </v-card>
            </v-menu> -->
        </template>
    </v-data-table-server>



    <v-bottom-sheet v-model="previewDialogOpen" inset>
        <v-card flat>
            <!-- <v-card-title>
            </v-card-title> -->
            <v-card-text>
                <order-preview v-if="previewDialogOrder" :order="previewDialogOrder" @close="() => previewDialogOpen = !previewDialogOpen" />
            </v-card-text>
        </v-card>
    </v-bottom-sheet>
</template>

<script lang="ts" setup>
import Channel from '@/model/channel/channel';
import { ref, watch } from 'vue';
import { useTheme } from 'vuetify/lib/framework.mjs';
import { getPaginatedOrders } from '../../../../repository/order/order_repository';
import OrderPreview from './OrderPreview.vue';
import BulkImportShipmentAction from "../import/BulkImportShipmentActionBar.vue";
import ChannelOrderFilter from './filtter/ChannelOrderFilter.vue';
import { getStatusColor } from '@/utils/color';
import { formatDate } from '@/utils/format';
import { reactive } from 'vue';
import ShipmentFulfilmentCard from '@/views/shipment/ShipmentFulfilmentCard.vue';


const props = defineProps<{
    height?: number | string,
    channel: Channel,
    showSelect?: boolean,
    modelValue?: string[],
}>();

const emit = defineEmits<{
    (e: 'update:model-value', selected: string[]): void;
}>();


const theme = useTheme();


const criteria = reactive<{
    status?: string
}>({});



const headers = [
    { title: 'ID', key: 'id', value: 'channelOrderId', },
    // { title: 'Code', key: 'code', },
    { title: 'Status', key: 'status', },
    { title: 'Delivery Date', key: 'expiresAt', },
    { title: 'Shipping Address', key: 'shippingAddress', sortable: false },
    // {   title: 'Total', sortable: true, key: 'total',  },
    { title: 'Products', key: 'items', },
    { title: 'Created At', key: 'createdAt', },
    { title: 'Actions', key: 'actions', sortable: false },
];


const itemsPerPage = ref(100);

const search = ref('');
const serverItems = ref<any[]>([]);
const loading = ref(true);
const totalItems = ref(0);

const selected = ref<string[]>(props.modelValue ?? []);


watch(() => props.modelValue, (value) => selected.value = value ?? []);
watch(selected, (selected) => emit('update:model-value', selected));


watch(
    () => criteria,
    (criteria) => {
        loadItems({
            itemsPerPage: itemsPerPage.value,
            // sortBy: sortBy.value,
            sortBy: {},
            criteria,
        })
    }, { deep: true });



async function loadItems({ page, itemsPerPage: limit, sortBy, criteria: _criteria }: { page?: number, itemsPerPage?: number, sortBy?: any, criteria?: { [i: string]: any } }) {
    try {

        _criteria = _criteria ?? criteria;

        loading.value = true;
        const pagination = await getPaginatedOrders({ page, limit, channel: props.channel, criteria: _criteria });
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



const previewDialogOpen = ref(false);
const previewDialogLoading = ref(false);
const previewDialogError = ref<string | null>(null);
const previewDialogOrder = ref<any>(null);


function previewOrder(order: any) {
    previewDialogOpen.value = true;
    previewDialogOrder.value = order;
}


function onImport(data: any) {
    loadItems({});
}
</script>