<template>
    <v-btn v-if="!smAndDown" @click="() => updateStatus('intransit')" color="primary" variant="flat" class="mx-2"
        :loading="isLoading" :elevation="0">
        Pickup/Intransit
        <v-icon class="mx-1" size="large">mdi-truck</v-icon>
    </v-btn>

    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="primary" :loading="isLoading" :elevation="0" variant="outlined">
                <span>Update status</span>
                <v-icon>mdi-menu-down</v-icon>
            </v-btn>
        </template>
        <v-card flat>
            <v-form ref="form">
                <v-card-text>
                    <v-radio-group v-model="selectedStatus">
                        <v-radio v-for="(status, i) in statuses" :key="status.value" :label="status.text"
                            :disabled="isLoading || !possibleStatuses.some(e => e.value == status.value)"
                            @click.stop="() => undefined" :value="status.value"></v-radio>
                    </v-radio-group>
                </v-card-text>
                <v-card-actions>
                    <slot name="action" v-bind="{ selectedStatus, shipments, statuses, possibleStatuses, }">
                        <v-btn @click="() => updateStatus()" color="primary" :elevation="0" variant="flat"
                            :disabled="!selectedStatus" :loading="isLoading" block>
                            Update
                        </v-btn>
                    </slot>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-menu>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import { computed, ref, defineProps } from 'vue';
import { useNotifier } from 'vuetify-notifier';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { useDisplay } from 'vuetify';
import { ShipmentDocumentFileAttachmentFormData } from '@/model/shipment/shipment_document_attachment';

interface ShipmentBulkTransitionArgs { 
    shipments: (Shipment|string|number)[];
    transition: string;
    description?: string;
    attachments?: ShipmentDocumentFileAttachmentFormData[] ;
}

const props = defineProps<{
    shipments: (Shipment | string | number)[];
    loading?: boolean;
    applyTransition(input: ShipmentBulkTransitionArgs): Promise<string[]>,
}>();

const emit = defineEmits<{
    (e: 'update', shipmentIds: string[]): void;
    (e: 'updated', shipmentIds: string[]): void;
}>();


const notifier = useNotifier();
const { xs, smAndDown, sm, } = useDisplay();

const form = ref<VForm>();

// const status = computed(() => props.shipment?.status);
const selectedStatus = ref<string>();
const attachments = ref<File[]>();
function selectStatus(status: string) {
    selectedStatus.value = status;
}
// selectedStatus

const isUpdating = ref(false);

async function updateStatus(transition?: string) {
    try {
        if (form.value) {
            const { valid, errors } = await form.value.validate();
            if (!valid) {
                throw new Error(errors.toString());
            }
        }
        const shipments = props.shipments;
        isUpdating.value = true;
        transition ??= selectedStatus.value!;
        const result = await props.applyTransition({ shipments, transition, });
        emit('updated', result);
        notifier.toastSuccess(`Updated ${result?.length} shipments Successfully!`);
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
    // { text: 'New', value: 'new' },
    // { text: 'Assigned', value: 'assigned' },
    // { text: 'Processing', value: 'processing' },
    // { text: 'Ready', value: 'ready' },
    { text: 'Pickup/In Transit', value: 'intransit' },
    // { text: 'Delivered', value: 'delivered' },
    { text: 'On Hold', value: 'onhold' },
    { text: 'Rejected by Customer', value: 'rejected' },
    // { text: 'Completed', value: 'completed' },
    { text: 'Cancelled', value: 'cancelled' },
];

const possibleStatuses = computed(() => {
    return statuses;
});

</script>