<template>
    <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items-length="totalItems"
        :items="serverItems" :loading="loading" :search="search" item-value="name" :height="height ?? 'calc(100vh - 200px)'"
        @update:options="loadItems">

        <template v-slot:item.logo="{ item: { logoImage } }">
            <div v-if="logoImage">
                <v-img :src="logoImage.url"/>
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


        <template v-slot:item.actions="{ item: { id } }">

            <v-btn color="primary" :to="{ name: 'admin:carrier:show', params: { id } }" :disabled="loading" :elevation="0"
                variant="flat" size="small" rounded>
                View
                <v-icon>mdi-eye</v-icon>
            </v-btn>

            <v-btn color="primary" :to="{ name: 'admin:carrier:edit', params: { id } }" :elevation="0" size="small" class="mx-1" rounded>
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
    { title: 'ID', key: 'id', },
    { title: 'Logo', key: 'logo', },
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


async function loadItems({ page, itemsPerPage: limit, sortBy }: { page?: number, itemsPerPage?: number, sortBy: any }) {
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
</script>