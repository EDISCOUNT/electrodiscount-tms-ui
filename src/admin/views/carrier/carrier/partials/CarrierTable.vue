<template>
    <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items-length="totalItems"
        :items="serverItems" :loading="loading" :search="search" item-value="name" :height="height ?? 'calc(100vh - 200px)'"
        @update:options="loadItems">

        <template v-slot:item.logo="{ item: { logoImage } }">
            <div v-if="logoImage">
                <v-img :src="logoImage.url" />
            </div>
            <span class="text-grey" v-else>N/A</span>
        </template>

        <template v-slot:item.enabled="{ item: { enabled } }">
            <v-chip color="primary" class="pl-1" size="small">
                <template v-slot:prepend>
                    <v-icon>{{ enabled ? 'mdi-check' : 'mdi-close' }}</v-icon>
                </template>
                {{ enabled ? 'Enabled' : 'Disabled' }}
            </v-chip>
        </template>

        <template v-slot:item.operatorUser="{ item: { operatorUser } }">
            <div v-if="operatorUser">
                {{ operatorUser.fullName }}
            </div>
            <span class="text-grey" v-else>N/A</span>
        </template>



        <!-- <template v-slot:item.name="{ item }">
            <span>{{ item }}</span>
        </template> -->


        <template v-slot:item.actions="{ item: carrier }">

            <v-btn color="primary" :to="{ name: 'admin:carrier:show', params: { id: carrier.id } }" :disabled="loading"
                :elevation="0" variant="flat" size="small" class="mx-1" rounded>
                View
                <v-icon>mdi-eye</v-icon>
            </v-btn>

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
                            <v-list-item :to="{ name: 'admin:carrier:edit', params: { id: carrier.id } }">
                                <template v-slot:prepend>
                                    <v-icon>mdi-pencil</v-icon>
                                </template>
                                <template v-slot:title>
                                    <span>Edit</span>
                                </template>
                            </v-list-item>
                            <v-divider />
                            <v-list-item @click="() => deleteSingleCarrier(carrier)">
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

            <!-- <v-btn color="primary" :to="{ name: 'admin:carrier:edit', params: { id } }" :elevation="0" size="small"
                class="mx-1" rounded>
                <v-icon>mdi-pencil</v-icon>
                Edit
            </v-btn> -->
        </template>

    </v-data-table-server>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getPaginatedCarriers, deleteCarrier } from '@/admin/repository/carrier/carrier_repository';
import { debounce } from 'lodash';
import { useNotifier } from 'vuetify-notifier';
import Carrier from '@/model/carrier/carrier';


const props = defineProps<{
    height?: number | string,

}>();




const headers = [
    { title: 'ID', key: 'id', },
    { title: 'Logo', key: 'logo', sortable: false },
    { title: 'Code', key: 'code', },
    {
        title: 'Name',
        sortable: true,
        key: 'name',
    },
    { title: 'Owner Operator', key: 'operatorUser', },
    { title: 'Email Address', key: 'emailAddress', },
    { title: 'Phone Number', key: 'phoneNumber', },
    { title: 'Status', key: 'enabled', },
    { title: 'Actions', key: 'actions', },
];


const itemsPerPage = ref(10);

const search = ref('');
const serverItems = ref<any[]>([]);
const loading = ref(true);
const totalItems = ref(0);


async function doLoadItems({ page, itemsPerPage: limit, sortBy }: { page?: number, itemsPerPage?: number, sortBy?: any }) {
    try {
        loading.value = true;
        const pagination = await getPaginatedCarriers({ page, limit });
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
const loadItems = debounce(doLoadItems, 100);




async function refresh() {
    await loadItems({});
}

const notifier = useNotifier();
const isDeleting = ref(false);
async function deleteSingleCarrier(carrier: Carrier) {
    try {
        const mayDelete = await notifier.confirm({
            title: "Delete Carrier",
            text: "Are you sure you want to delete this carrier?"
        });
        if (!mayDelete) {
            return;
        }
        isDeleting.value = true;
        const result = await deleteCarrier(carrier.id! as any);
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