<template>
    <!-- {{ {filter, } }} -->
    <v-data-table-server v-model="selected" v-model:items-per-page="itemsPerPage" :headers="filteredHeaders as any"
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
                    <v-chip v-else-if="i == (items.length - 1)" size="small">
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

        <template v-slot:item.channelOrderId="{ item: { id, channelOrderId } }">
            <RouterLink :to="{ name: 'admin:shipment:show', params: { id: id } }" style="text-decoration: none;">
                <div v-if="channelOrderId">
                    {{ channelOrderId }}
                </div>
                <span class="text-grey" v-else>
                    [N/A]
                </span>
            </RouterLink>
        </template>

        <template v-slot:item.channel="{ item: { channel } }">
            <div v-if="channel">
                {{ channel.name }}
            </div>
            <span class="text-grey" v-else>
                N/A
            </span>
        </template>

        <template v-slot:item.deliveryDate="{ item: { deliveryDate } }">
            <div v-if="deliveryDate">
                {{ formatDate(deliveryDate) }}
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
            <small>{{ fulfilmentType }}</small>
        </template>

        <template v-slot:item.actions="{ item: shipment }">
            <v-card-actions>
                <v-btn color="primary" :to="{ name: 'admin:shipment:show', params: { id: shipment.id } }"
                    :disabled="loading" :elevation="0" variant="flat" size="small" rounded>
                    View
                    <v-icon>mdi-eye</v-icon>
                </v-btn>

                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" color="primary" :disabled="loading" :elevation="0" variant="outlined"
                            size="small" rounded>
                            Options
                            <v-divider class="mx-1" vertical />
                            <v-icon>mdi-chevron-down</v-icon>
                        </v-btn>
                    </template>
                    <v-card flat>
                        <v-card-text class="pa-0">
                            <v-list>
                                <v-list-item :to="{ name: 'admin:shipment:edit', params: { id: shipment.id } }">
                                    <template v-slot:prepend>
                                        <v-icon>mdi-pencil</v-icon>
                                    </template>
                                    <template v-slot:title>
                                        <span>Edit</span>
                                    </template>
                                </v-list-item>
                                <template v-if="shipment.isDelivered">
                                    <v-divider />
                                    <ShipmentReturnDialog @retruned="() => refresh()" :shipment="shipment" show-button>
                                        <template v-slot:activator="{ props: returnProps }">
                                            <v-list-item v-bind="returnProps">
                                                <template v-slot:prepend>
                                                    <v-icon>mdi-truck</v-icon>
                                                </template>
                                                <template v-slot:title>
                                                    <span>Return</span>
                                                </template>
                                            </v-list-item>
                                        </template>
                                    </ShipmentReturnDialog>
                                </template>
                                <v-divider />
                                <v-list-item @click="() => deleteSingleShipment(shipment)">
                                    <template v-slot:prepend>
                                        <v-icon color="red">mdi-delete</v-icon>
                                    </template>
                                    <template v-slot:title>
                                        <span>Delete</span>
                                    </template>
                                </v-list-item>

                            </v-list>
                        </v-card-text>
                    </v-card>
                </v-menu>

            </v-card-actions>
        </template>


        <template v-slot:item.createdAt="{ item: { createdAt } }">
            <!-- {{ {carrier} }} -->
            <div v-if="createdAt">
                {{ formatDate(createdAt) }}
            </div>
            <span class="text-grey" v-else>
                N/A
            </span>
        </template>
    </v-data-table-server>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { getPaginatedShipments, deleteShipment } from '../../../../repository/shipment/shipment_repository';
import { useDisplay } from 'vuetify';
import { computed } from 'vue';
import { getStatusColor } from '@/utils/color';
import { formatDate } from '@/utils/format';
import Shipment from '@/model/shipment/shipment';
import ShipmentFulfilmentCard from '@/views/shipment/ShipmentFulfilmentCard.vue';
import ShipmentReturnDialog from '../return/ShipmentReturnDialog.vue';
import { useNotifier } from 'vuetify-notifier';
import { debounce } from 'lodash';


const props = defineProps<{
    height?: number | string;
    showSelect?: boolean;
    modelValue?: string[];
    filter?: { [i: string]: any };
    removedHeaders?: string[]
}>();

const emit = defineEmits<{
    (e: 'update:model-value', selected: string[]): void;
}>();



const notifier = useNotifier();
const { xs, smAndDown, smAndUp, mdAndUp, sm, lg } = useDisplay();

const height = computed(() => {

    if (props.height) {
        return props.height;
    }

    if (xs.value) {
        return 'calc(100vh - 210px)';
    }
    return 'calc(100vh - 315px)'
})

const headers = [
    //{
    //    title: 'ID',
    //    // align: 'start',
    //    // sortable: false,
    //    sortable: true,
    //    fixed: smAndUp,
    //    minWidth: '100px',
    //    key: 'id',
    //},
    // {
    //     title: 'Code', key: 'code',
    //     //  align: 'end' 
    // },

    {
        title: 'Actions', key: 'actions',
        sortable: false,
        width: '250px',
        fixed: smAndUp,
        //  align: 'end' 
    },
    {
        title: 'Order ID', key: 'channelOrderId',
        sortable: true,
        //    fixed: smAndUp,
        minWidth: '120px',
        align: 'end'
    },
    {
        title: 'Status', key: 'status',
        sortable: false,
        align: 'center'
    },
    {
        title: 'Expected Delivery Date', key: 'expiresAt',
        sortable: false,
        minWidth: '200px',
        align: 'center',
    },
    {
        title: 'Delivery Date', key: 'deliveryDate',
        sortable: false,
        minWidth: '120px',
        align: 'center',
    },
    {
        title: 'Destination', key: 'destinationAddress',
        sortable: false,
        minWidth: '300px',
        //    fixed: mdAndUp,
        align: 'center',
        //  align: 'center' 
    },
    {
        title: 'Products', key: 'items',
        sortable: false,
        //  align: 'center' 
        minWidth: '500px',
        align: 'center',
    },
    {
        title: 'Carrier', key: 'carrier',
        sortable: false,
        // align: 'center' 
        minWidth: '200px',
        align: 'center'
    },
    {
        title: 'Channel', key: 'channel',
        sortable: false,
        minWidth: '200px',
        align: 'center',
        // align: 'center' 
    },
    // {
    //     title: 'Status', key: 'status',
    //     //  align: 'center'
    // },
    {
        title: 'Fulfilment Type', key: 'fulfilmentType',
        sortable: false,
        minWidth: '150px',
        align: 'center',
        // align: 'center'
    },
    {
        title: 'Created At',
        key: 'createdAt',
        sortable: true,
        minWidth: '250px',
        align: 'center',
        // align: 'center'
    },
    //{
    //    title: 'Actions', key: 'actions',
    //    sortable: false,
    //    //  align: 'end' 
    //},
];

const filteredHeaders = computed(() => {
    if (!props.removedHeaders) {
        return headers;
    }
    return headers.filter(e => !props.removedHeaders!.includes(e.key));
});


const itemsPerPage = ref(100);
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
        console.log("DATA CHANGED:", filter);
        loadItems({
            page: tablePage.value,
            itemsPerPage: itemsPerPage.value,
            // sortBy: sortBy.value,
            sortBy: {},
            filter: filter,
        })
    }, { deep: false });


async function doLoadItems({ page, itemsPerPage: limit, sortBy, filter }: { page?: number, itemsPerPage?: number, sortBy?: any, filter?: { [i: string]: any } }) {
    try {
        //console.log("SORT BY: ", { sortBy });
        const criteria = {
            ...{
                ...(filter ?? props.filter ?? {}),
                //status: undefined
            },
        };

        loading.value = true;
        const pagination = await getPaginatedShipments({ page, limit, criteria });
        tablePage.value = page ?? 1;
        serverItems.value = [...pagination.items];
        totalItems.value = pagination.pageInfo.totalItems;
        itemsPerPage.value = pagination.pageInfo.perPage;

    }
    catch (err) {
        const message = (err as any).message;
        notifier.toastError(message);
        throw err;
    }
    finally {
        loading.value = false;
    }
}

const loadItems = debounce(doLoadItems, 1000);



async function refresh() {
    selected.value = [];
    await loadItems({});
}


const isDeleting = ref(false);

async function deleteSingleShipment(shipment: Shipment) {
    try {
        const mayDelete = await notifier.confirmError({
            title: `Delete Shipment ${shipment?.channelOrderId}?`,
            text: `Are you sure you want to delete this shipment?\n Operation is not reversible!`
        });
        if (!mayDelete) {
            return;
        }
        isDeleting.value = true;
        const result = await deleteShipment(shipment.id! as any);
        refresh();
    }
    catch (err) {
        const message = (err as any).message;
        notifier.toastError(message);
    }
    finally {
        isDeleting.value = false;
    }
}


defineExpose({
    refresh,
})
</script>