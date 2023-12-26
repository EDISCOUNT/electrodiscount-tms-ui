<template>
    <v-card flat>
        <!-- <v-card-title>
            Update Shipment Status
        </v-card-title> -->
        <v-card-text>
            <!-- {{ { status } }} -->

            <!-- <v-card @click="() => selectStatus(status.value)" v-for="(status, i) in possibleStatuses" :key="status.value"
                :color="status.value == selectedStatus ? 'primary' : 'grey'" class="my-2" variant="outlined" flat>
                <v-list-item>
                    <template v-slot:title>
                        {{ status.text }}
                    </template>
                </v-list-item>
            </v-card> -->

            <v-radio-group v-model="selectedStatus">
                <v-radio v-for="(status, i) in statuses" :key="status.value" :label="status.text" :disabled="!possibleStatuses.some(e => e.value == status.value)"
                    :value="status.value"></v-radio>
            </v-radio-group>

        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :elevation="0" variant="flat" block>
                Update
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import { formatDate } from '@/utils/format'
import { computed, ref, defineProps } from 'vue';

const props = defineProps<{
    shipment: Shipment
}>();

const status = computed(() => props.shipment?.status);
const selectedStatus = ref<string>();
function selectStatus(status: string) {
    selectedStatus.value = status;
}
// selectedStatus

const statuses = [
    { text: 'New', value: 'new' },
    { text: 'Assigned', value: 'assigned' },
    { text: 'Processing', value: 'processing' },
    { text: 'Ready', value: 'ready' },
    { text: 'In Transit', value: 'intransit' },
    { text: 'Delivered', value: 'delivered' },
    { text: 'Completed', value: 'completed' },
    { text: 'Cancelled', value: 'cancelled' },
];

const possibleStatuses = computed(() => {
    switch (status.value) {
        case 'new':
        case 'assigned':
            return statuses.filter((e) => ['processing', 'ready'].includes(e.value));
        //
        case 'processing':
            return statuses.filter((e) => ['ready'].includes(e.value));
        //
        case 'ready':
            return statuses.filter((e) => ['intransit'].includes(e.value));
        // 
        case 'intransit':
            return statuses.filter((e) => ['delivered'].includes(e.value));
        // 
        case 'delivered':
            return statuses.filter((e) => ['completed'].includes(e.value));
    }
});

</script>