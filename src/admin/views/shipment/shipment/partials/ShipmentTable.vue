<template>
    <!-- {{ {filter, } }} -->
    <v-data-table-server v-model="selected" v-model:items-per-page="itemsPerPage" :headers="headers"
        :items-length="totalItems" :items="serverItems" :loading="loading" :search="search" item-value="id"
        :height="height ?? 'calc(100vh - 290px)'" @update:options="loadItems" :show-select="showSelect" fixed-header>


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


const props = defineProps<{
    height?: number | string;
    showSelect?: boolean;
    modelValue?: string[];
    filter?: { [i: string]: any };

}>();

const emit = defineEmits<{
    (e: 'update:model-value', selected: string[]): void;
}>();




const headers = [
    {
        title: 'ID',
        // align: 'start',
        // sortable: false,
        key: 'id',
    },
    {
        title: 'Code', key: 'code',
        //  align: 'end' 
    },
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
        title: 'Status', key: 'status',
        //  align: 'center'
    },
    {
        title: 'Channel', key: 'channel',
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


async function loadItems({ page, itemsPerPage: limit, sortBy, filter }: { page?: number, itemsPerPage?: number, sortBy: any, filter?: { [i: string]: any } }) {
    try {
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
</script>