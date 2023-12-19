<template>
    <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items-length="totalItems"
        :items="serverItems" :loading="loading" :search="search" item-value="name" :height="height?? 'calc(100vh - 200px)'"
        @update:options="loadItems"></v-data-table-server>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getPaginatedShipments } from '../../../repository/shipment/shipment_repository';


const props = defineProps<{
    height?: number| string,

}>();




const headers = [
    {
        title: 'Dessert (100g serving)',
        align: 'start',
        sortable: false,
        key: 'name',
    },
    { title: 'Calories', key: 'calories', align: 'end' },
    { title: 'Fat (g)', key: 'fat', align: 'end' },
    { title: 'Carbs (g)', key: 'carbs', align: 'end' },
    { title: 'Protein (g)', key: 'protein', align: 'end' },
    { title: 'Iron (%)', key: 'iron', align: 'end' },
];


const itemsPerPage = ref(5);

const search = ref('');
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);


async function loadItems({ page, itemsPerPage, sortBy }: { page?: number, itemsPerPage?: number, sortBy: any }) {

    try {
        loading.value = true;

        const shipments = await getPaginatedShipments({ page, limit: itemsPerPage });

    }
    catch (err) {
        throw err;
    }
    finally {
        loading.value = false;
    }

}
</script>