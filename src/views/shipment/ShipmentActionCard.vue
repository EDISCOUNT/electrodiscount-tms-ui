<template>
    <v-card flat>
        <!-- <v-card-title>
            Update Shipment Status
        </v-card-title> -->
        <v-form ref="form">
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
            <v-divider />
            <v-card-text>
                <template v-if="isDelivery">
                    <!-- <v-file-input v-model="attachments" chips multiple label="Add file Attachments" variant="outlined"
                        :rules="[
                            (v) => (selectedStatus != 'delivered') || v?.length > 0 || 'This filed is required'
                        ]"></v-file-input>
                    <span v-if="selectedStatus == 'delivered'">
                        You must provide a file attachment to proceed
                    </span> -->

                    <ShipmentDocumentDrawer v-model:attachments="attachments" :shipment="shipment" />
                    <v-divider class="my-3" />
                </template>
                <template v-if="isCancelation || isHold">
                    <v-textarea v-model="description" label="Reason" placeholder="Enter reasaon"
                        variant="outlined" density="compact" :counter="255">
                    </v-textarea>
                </template>
                <template v-else>
                    <v-textarea v-model="description" label="Description(Optional)" placeholder="Enter addition information"
                        variant="outlined" density="compact" :counter="255">
                    </v-textarea>
                </template>
            </v-card-text>
            <!-- <v-divider/> -->
            <v-card-actions>
                <slot name="action" v-bind="{ selectedStatus, status, shipment, statuses, possibleStatuses, }">
                    <v-btn @click="() => updateStatus()" color="primary" :elevation="0" variant="flat"
                        :disabled="!selectedStatus" :loading="isLoading" block>
                        Update
                    </v-btn>
                </slot>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import { applyTransition } from '@/admin/repository/shipment/shipment_repository';
import { ShipmentDocumentFileAttachmentFormData } from '@/model/shipment/shipment_document_attachment';
import { formatDate } from '@/utils/format'
import { computed, ref, defineProps } from 'vue';
import { useNotifier } from 'vuetify-notifier';
import { VForm } from 'vuetify/lib/components/index.mjs';
import ShipmentDocumentDrawer from './document/ShipmentDocumentDrawer.vue';

const props = defineProps<{
    shipment: Shipment;
    loading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update', shipment: Shipment): void;
    (e: 'updated', shipment: Shipment): void;
}>();


const notifier = useNotifier();

const form = ref<VForm>();

const status = computed(() => props.shipment?.status);
const selectedStatus = ref<string>();
const attachments = ref<ShipmentDocumentFileAttachmentFormData[]>();
const description = ref<string>();
function selectStatus(status: string) {
    selectedStatus.value = status;
}
const isDelivery = computed(() => selectedStatus.value == 'delivered');
const isCancelation = computed(() => selectedStatus.value == 'cancelled');
const isHold = computed(() => selectedStatus.value == 'onhold');
// selectedStatus

const isUpdating = ref(false);

async function updateStatus() {
    try {
        const { valid, errors } = await form.value!.validate();
        if (!valid) {
            throw new Error(errors.toString());
        }
        isUpdating.value = true;
        const shipment = props.shipment;
        const transition = selectedStatus.value!;
        const result = await applyTransition({ shipment, transition, attachments: attachments.value, description: description.value });
        emit('updated', result);
        notifier.toastSuccess("Shipment Status Updated Successfully!");
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
    { text: 'On Hold', value: 'onhold' },
    { text: 'Pickup/In Transit', value: 'intransit' },
    { text: 'Delivered', value: 'delivered' },
    // { text: 'Completed', value: 'completed' },
    { text: 'Cancelled', value: 'cancelled' },
];

const possibleStatuses = computed(() => {
    switch (status.value) {
        case 'new':
            return statuses.filter((e) => ['assigned', 'processing', 'onhold', 'cancelled',].includes(e.value));
        case 'assigned':
            return statuses.filter((e) => ['processing', 'ready', 'onhold', 'cancelled',].includes(e.value));
        //
        case 'processing':
            return statuses.filter((e) => ['ready', 'intransit', 'onhold', 'cancelled',].includes(e.value));
        //
        case 'ready':
            return statuses.filter((e) => ['intransit', 'onhold', 'cancelled',].includes(e.value));
        // 
        case 'intransit':
            return statuses.filter((e) => ['delivered', 'onhold', 'cancelled',].includes(e.value));
        // 
        case 'delivered':
            return statuses.filter((e) => ['completed',].includes(e.value));

        default:
            return [];
    }
});

</script>