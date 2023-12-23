<template>
    <v-data-table-server v-model="selected" v-model:items-per-page="itemsPerPage" :headers="headers"
        :items-length="totalItems" :items="serverItems" :loading="loading" :search="search" item-value="channelOrderId"
        :height="height ?? 'calc(100vh - 260px)'" @update:options="loadItems" :show-select="showSelect">


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
                <v-chip-group>
                    <v-chip color="primary" size="small" label>
                        All
                    </v-chip>

                    <v-chip color="primary" size="small" label>
                        Assigned
                    </v-chip>

                    <v-chip color="primary" size="small" label>
                        Unplanned
                    </v-chip>

                    <v-chip color="primary" size="small" label>
                        Completed
                    </v-chip>
                </v-chip-group>
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


        <template v-slot:item.status="{ item: { status } }">
            <template v-if="status">
                <v-chip>
                    {{ status }}
                </v-chip>
            </template>
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
                    <v-chip v-else-if="i == (items.length - 1)">
                        {{ items.length - 1 }} More
                    </v-chip>
                </div>
            </template>
            <span v-else class="text-grey">N/A</span>
        </template>


        <template v-slot:item.date="{ item: { fulfilments } }">
            <template v-if="fulfilments">
                <template v-for="(fulfilment, i) in fulfilments" :key="fulfilment.id ?? i">
                    <div v-if="i == 0">
                        <span v-if="fulfilment.expiryDate">
                            {{ fulfilment.expiryDate }}
                        </span>
                        <span class="text-grey" v-else>
                            Name Not Found
                        </span>
                    </div>
                    <v-chip v-else-if="i == (fulfilments.length - 1)">
                        {{ fulfilments.length - 1 }} More
                    </v-chip>
                </template>
            </template>
            <span v-else class="text-grey">N/A</span>
        </template>




        <template v-slot:item.actions="{ item }">
            <!-- <v-btn color="primary" :to="{ name: 'admin:order:edit', params: { id: item.id } }">
                <v-icon>mdi-pencil</v-icon>
            </v-btn> -->
            <v-btn @click="() => previewOrder(item)" color="primary" :elevation="0" variant="flat" size="small">
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
                <order-preview :order="previewDialogOrder" @close="() => previewDialogOpen = !previewDialogOpen" />
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
import BulkImportShipmentAction from '../import/BulkImportShipmentAction.vue';


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




const headers = [
    { title: 'ID', key: 'id', value: 'channelOrderId', },
    // { title: 'Code', key: 'code', },
    {
        title: 'Total',
        
        sortable: true,
        key: 'total',
    },
    { title: 'Products', key: 'items', },
    { title: 'Shipping Address', key: 'shippingAddress', sortable: false },
    { title: 'Status', key: 'status', },
    { title: 'Expiry Date', key: 'date', },
    { title: 'Actions', key: 'actions', sortable: false },
];


const itemsPerPage = ref(10);

const search = ref('');
const serverItems = ref<any[]>([]);
const loading = ref(true);
const totalItems = ref(0);

const selected = ref<string[]>(props.modelValue ?? []);


watch(() => props.modelValue, (value) => selected.value = value ?? []);
watch(selected, (selected) => emit('update:model-value', selected));



async function loadItems({ page, itemsPerPage: limit, sortBy }: { page?: number, itemsPerPage?: number, sortBy: any }) {
    try {
        loading.value = true;
        const pagination = await getPaginatedOrders({ page, limit, channel: props.channel });
        serverItems.value = [ ...pagination.items ];
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

}
</script>