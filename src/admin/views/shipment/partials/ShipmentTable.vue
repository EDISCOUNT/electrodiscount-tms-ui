<template>
    <v-data-table-server v-model="selected" v-model:items-per-page="itemsPerPage" :headers="headers"
        :items-length="totalItems" :items="serverItems" :loading="loading" :search="search" item-value="id"
        :height="height ?? 'calc(100vh - 200px)'" @update:options="loadItems" :show-select="showSelect">


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

        <template v-slot:item.actions="{ item }">
            <v-btn color="primary" :to="`/admin/shipment/${item.id}`" :loading="loading" :disabled="loading" :elevation="0"
                variant="flat">
                View
            </v-btn>
        </template>
    </v-data-table-server>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { getPaginatedShipments } from '../../../repository/shipment/shipment_repository';


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
        align: 'start',
        sortable: false,
        key: 'id',
    },
    { title: 'Code', key: 'code', align: 'end' },
    { title: 'Destination', key: 'destinationAddress', align: 'center' },
    { title: 'Carrier', key: 'carrier', align: 'center' },
    { title: 'Status', key: 'status', align: 'center' },
    { title: 'Channel', key: 'channel', align: 'center' },
    { title: 'Actions', key: 'actions', align: 'end' },
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
        serverItems.value = [...serverItems.value, ...pagination.items];
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