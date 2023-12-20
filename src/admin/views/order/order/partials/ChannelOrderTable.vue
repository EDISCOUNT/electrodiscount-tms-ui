<template>
    <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items-length="totalItems"
        :items="serverItems" :loading="loading" :search="search" item-value="name" :height="height ?? 'calc(100vh - 200px)'"
        @update:options="loadItems">

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
                        <span v-if="item?.product?.name">
                            {{ item.product.name }}
                        </span>
                        <span class="text-grey" v-else>
                            Name Not Found
                        </span>
                    </div>
                    <v-chip v-else-if="i == (items.length - 1)">
                        {{ items.length - 1 }} More
                    </v-chip>
                </div>
            </template>
            <span v-else class="text-grey">N/A</span>
        </template>




        <template v-slot:item.actions="{ item }">
            <!-- <v-btn color="primary" :to="{ name: 'admin:order:edit', params: { id: item.id } }">
                <v-icon>mdi-pencil</v-icon>
            </v-btn> -->
            <v-btn @click="() => previewOrder(item)" color="primary" :elevation="0" variant="flat">
                Ship
                <v-icon>mdi-pencil</v-icon>
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
        <order-preview :order="previewDialogOrder" @close="() => previewDialogOpen = !previewDialogOpen" />
    </v-bottom-sheet>
</template>

<script lang="ts" setup>
import Channel from '@/model/channel/channel';
import { ref } from 'vue';
import { getPaginatedOrders } from '../../../../repository/order/order_repository';
import OrderPreview from './OrderPreview.vue';


const props = defineProps<{
    height?: number | string,
    channel: Channel,
}>();




const headers = [
    { title: 'ID', key: 'id', value: 'channelOrderId', align: 'start' },
    // { title: 'Code', key: 'code', align: 'end' },
    {
        title: 'Total',
        align: 'start',
        sortable: false,
        key: 'total',
    },
    { title: 'Products', key: 'items', align: 'center' },
    { title: 'Shipping Address', key: 'shippingAddress', align: 'end' },
    { title: 'Status', key: 'status', align: 'end' },
    { title: 'Actions', key: 'actions', align: 'end' },
];


const itemsPerPage = ref(5);

const search = ref('');
const serverItems = ref<any[]>([]);
const loading = ref(true);
const totalItems = ref(0);


async function loadItems({ page, itemsPerPage, sortBy }: { page?: number, itemsPerPage?: number, sortBy: any }) {

    try {
        loading.value = true;

        const pagination = await getPaginatedOrders({ page, limit: itemsPerPage, channel: props.channel });
        const orders = pagination.items;
        serverItems.value = [...serverItems.value, ...orders];

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
</script>