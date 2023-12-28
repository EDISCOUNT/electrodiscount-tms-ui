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
                <v-radio v-for="(status, i) in statuses" :key="status.value" :label="status.text"
                    :disabled="isLoading || !possibleStatuses.some(e => e.value == status.value)"
                    :value="status.value"></v-radio>
            </v-radio-group>

        </v-card-text>
        <v-card-actions>
            <slot name="action" v-bind="{ selectedStatus, status, shipment, statuses, possibleStatuses, }">
                <v-btn @click="() => updateStatus()" color="primary" :elevation="0" variant="flat"
                    :disabled="!selectedStatus" :loading="isLoading" block>
                    Update
                </v-btn>
            </slot>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import { applyTransition } from '@/admin/repository/shipment/shipment_repository';
import { formatDate } from '@/utils/format'
import { computed, ref, defineProps } from 'vue';
import { useNotifier } from 'vuetify-notifier';

const props = defineProps<{
    shipment: Shipment;
    loading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update', shipment: Shipment): void;
    (e: 'updated', shipment: Shipment): void;
}>();


const notifier = useNotifier();

const status = computed(() => props.shipment?.status);
const selectedStatus = ref<string>();
function selectStatus(status: string) {
    selectedStatus.value = status;
}
// selectedStatus

const isUpdating = ref(false);

async function updateStatus() {
    try {
        isUpdating.value = true;
        const shipment = props.shipment;
        const transition = selectedStatus.value!;
        const result = await applyTransition({ shipment, transition });
        emit('updated', result);
        notifier.toastSuccess("Shipment Updated Successfully!");
    }
    catch (err) {
        const message = (err as Error).message;
        notifier.toastError(message);
    }
    finally {
        isUpdating.value = false;
    }
}



const isLoading = computed(() => isUpdating.value || props.loading);

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
            return statuses.filter((e) => ['assigned', 'processing'].includes(e.value));
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

        default:
                return [];
    }
});

</script>