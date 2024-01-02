<template>
    <v-data-table-server v-model="selected" v-model:items-per-page="itemsPerPage" :headers="headers"
        :items-length="totalItems" :items="serverItems" :loading="loading" :search="search" item-value="id"
        :height="height ?? 'calc(100vh - 210px)'" @update:options="loadItems" fixed-header :show-select="showSelect">


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
        

        <template v-slot:item.originAddress="{ item: { originAddress } }">
            <div v-if="originAddress">
                {{ originAddress.label }}
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

        <template v-slot:item.actions="{ item: { id } }">
            <v-btn color="primary" :to="{ name: 'carrier:shipment:show', params: { id } }" :disabled="loading"
                :elevation="0" variant="flat" size="small" rounded>
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
    height?: number | string,
    showSelect?: boolean,
    modelValue?: string[],

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
        title: 'Products', key: 'items',
        //  align: 'center' 
    },
    {
        title: 'Origin', key: 'originAddress',
        // align: 'center' 
    },
    {
        title: 'Destination', key: 'destinationAddress',
        //  align: 'center' 
    },
    {
        title: 'Status', key: 'status',
        //  align: 'center'
    },
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
const selected = ref<string[]>(props.modelValue ?? []);


watch(() => props.modelValue, (value) => selected.value = value ?? []);
watch(selected, (selected) => emit('update:model-value', selected));


async function loadItems({ page, itemsPerPage: limit, sortBy }: { page?: number, itemsPerPage?: number, sortBy: any }) {
    try {
        loading.value = true;
        const pagination = await getPaginatedShipments({ page, limit });
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