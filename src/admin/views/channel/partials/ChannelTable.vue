<template>
    <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items-length="totalItems"
        :items="serverItems" :loading="loading" :search="search" item-value="name" :height="height ?? 'calc(100vh - 200px)'"
        @update:options="loadItems">

        <template v-slot:item.type="{ item }">
            <template v-if="item.typeConfig">
                <v-chip color="primary" class="pl-1" dark>
                    <template v-slot:prepend>
                        <v-avatar>
                            <v-img :src="item.typeConfig.iconImage" />
                        </v-avatar>
                    </template>
                    {{ item.typeConfig.title }}
                </v-chip>
            </template>
            <span v-else class="text-grey">No Type</span>
        </template>


        <template v-slot:item.enabled="{ item: { enabled } }">
            <v-chip color="primary" class="pl-1"  size="small">
                <template v-slot:prepend>
                    <v-icon>{{ enabled ? 'mdi-check' : 'mdi-close' }}</v-icon>
                </template>
                {{ enabled ? 'Enabled' : 'Disabled' }}
            </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
            <v-btn color="primary" :to="{ name: 'admin:channel:edit', params: { id: item.id } }">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </template>
    </v-data-table-server>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getPaginatedChannels } from '../../../repository/channel/channel_repository';


const props = defineProps<{
    height?: number | string,

}>();




const headers = [
    { title: 'ID', key: 'id', align: 'end' },
    { title: 'Code', key: 'code', align: 'end' },
    {
        title: 'Name',
        align: 'start',
        sortable: false,
        key: 'name',
    },
    { title: 'type', key: 'type', align: 'end' },
    { title: 'Enabled', key: 'enabled', align: 'end' },
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

        const channels = await getPaginatedChannels({ page, limit: itemsPerPage });
        serverItems.value = [...serverItems.value, ...channels];

    }
    catch (err) {
        throw err;
    }
    finally {
        loading.value = false;
    }

}
</script>