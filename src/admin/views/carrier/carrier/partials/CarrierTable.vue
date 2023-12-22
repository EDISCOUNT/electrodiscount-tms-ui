<template>
    <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items-length="totalItems"
        :items="serverItems" :loading="loading" :search="search" item-value="name" :height="height ?? 'calc(100vh - 200px)'"
        @update:options="loadItems">

        <template v-slot:item.enabled="{ item: { enabled } }">
            <v-chip color="primary" class="pl-1" size="small">
                <template v-slot:prepend>
                    <v-icon>{{ enabled ? 'mdi-check' : 'mdi-close' }}</v-icon>
                </template>
                {{ enabled ? 'Enabled' : 'Disabled' }}
            </v-chip>
        </template>


        <!-- <template v-slot:item.name="{ item }">
            <span>{{ item }}</span>
        </template> -->


        <template v-slot:item.actions="{ item: { id } }">

            <v-btn color="primary" :to="{ name: 'admin:carrier:edit', params: { id } }" :elevation="0"
                size="small">
                <v-icon>mdi-pencil</v-icon>
                Edit
            </v-btn>
        </template>

    </v-data-table-server>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getPaginatedCarriers } from '@/admin/repository/carrier/carrier_repository';


const props = defineProps<{
    height?: number | string,

}>();




const headers = [
    { title: 'ID', key: 'id', align: 'start' },
    { title: 'Code', key: 'code', align: 'center' },
    {
        title: 'Name',
        align: 'start',
        sortable: true,
        key: 'name',
    },
    { title: 'Status', key: 'enabled', align: 'end' },
    { title: 'Actions', key: 'actions', align: 'end' },
];


const itemsPerPage = ref(10);

const search = ref('');
const serverItems = ref<any[]>([]);
const loading = ref(true);
const totalItems = ref(0);


async function loadItems({ page, itemsPerPage: limit, sortBy }: { page?: number, itemsPerPage?: number, sortBy: any }) {
    try {
        loading.value = true;
        const pagination = await getPaginatedCarriers({ page, limit });
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