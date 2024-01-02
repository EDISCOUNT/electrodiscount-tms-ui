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


        <template v-slot:item.ean="{ item: { gtin } }">
            <span v-if="gtin">{{ gtin }}</span>
            <span v-else class="text-grey">N/A</span>
        </template>


        <template v-slot:item.actions="{ item: { id } }">

            <v-btn color="primary" :to="{ name: 'admin:mailing:template:edit', params: { id } }" :elevation="0"
                size="small">
                <v-icon>mdi-pencil</v-icon>
                Edit
            </v-btn>
        </template>

    </v-data-table-server>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getPaginatedEmailMessageTemplates } from '@/repository/mailing/template_repository';


const props = defineProps<{
    height?: number | string,

}>();




const headers = [
    { title: 'ID', key: 'id', },
    // { title: 'Code', key: 'code', },
    { title: 'Label', key: 'label', },
    {
        title: 'Subject',

        sortable: true,
        key: 'subject',
    },
    { title: 'Enabled', key: 'enabled', },
    { title: 'Actions', key: 'actions', },
];


const itemsPerPage = ref(10);

const search = ref('');
const serverItems = ref<any[]>([]);
const loading = ref(true);
const totalItems = ref(0);


async function loadItems({ page, itemsPerPage: limit, sortBy }: { page?: number, itemsPerPage?: number, sortBy: any }) {
    try {
        loading.value = true;
        const pagination = await getPaginatedEmailMessageTemplates({ page, limit });
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