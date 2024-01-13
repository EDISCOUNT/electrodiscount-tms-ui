<template>
    <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="(headers as any)" :items-length="totalItems"
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


        <template v-slot:item.address="{ item: { address } }">
            <span v-if="address">{{ address.label }}</span>
            <span v-else class="text-grey">N/A</span>
        </template>


        <template v-slot:item.actions="{ item: storage }">

            <!-- <v-btn color="primary" :to="{ name: 'admin:inventory:storage:edit', params: { id } }" :elevation="0"
                size="small">
                <v-icon>mdi-pencil</v-icon>
                Edit
            </v-btn> -->

            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="primary" :disabled="loading" :elevation="0" variant="outlined" size="small"
                        rounded>
                        Options
                        <v-divider class="mx-1" vertical />
                        <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                </template>
                <v-card flat>
                    <v-card-text class="pa-0">
                        <v-list>
                            <v-list-item :to="{ name: 'admin:inventory:storage:edit', params: { id: storage.id } }">
                                <template v-slot:prepend>
                                    <v-icon>mdi-pencil</v-icon>
                                </template>
                                <template v-slot:title>
                                    <span>Edit</span>
                                </template>
                            </v-list-item>
                            <v-divider />
                            <v-list-item @click="() => deleteSingleStorage(storage)">
                                <template v-slot:prepend>
                                    <v-icon>mdi-delete</v-icon>
                                </template>
                                <template v-slot:title>
                                    <span>Delete</span>
                                </template>
                            </v-list-item>

                        </v-list>
                    </v-card-text>
                </v-card>
            </v-menu>

        </template>

    </v-data-table-server>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getPaginatedStorages, deleteStorage } from '@/admin/repository/inventory/storage_repository';
import { useNotifier } from 'vuetify-notifier';
import Storage from '@/model/inventory/storage';


const props = defineProps<{
    height?: number | string,

}>();




const headers = [
    { title: 'ID', key: 'id', },
    // { title: 'Code', key: 'code', },
    {
        title: 'Name',

        sortable: true,
        key: 'name',
    },
    { title: 'Address', key: 'address', align: 'center', },
    { title: 'Status', key: 'enabled', },
    { title: 'Actions', key: 'actions', },
];


const itemsPerPage = ref(10);

const search = ref('');
const serverItems = ref<any[]>([]);
const loading = ref(true);
const totalItems = ref(0);


async function loadItems({ page, itemsPerPage: limit, sortBy }: { page?: number, itemsPerPage?: number, sortBy?: any }) {
    try {
        loading.value = true;
        const pagination = await getPaginatedStorages({ page, limit });
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




async function refresh() {
    await loadItems({});
}

const notifier = useNotifier();
const isDeleting = ref(false);
async function deleteSingleStorage(storage: Storage) {
    try {
        const mayDelete = await notifier.confirm({
            title: "Delete Storage",
            text: "Are you sure you want to delete this storage?"
        });
        if (!mayDelete) {
            return;
        }
        isDeleting.value = true;
        const result = await deleteStorage(storage.id! as any);
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