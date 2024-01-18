<template>
    <v-btn @click="() => deleteShipments()" :loading="isGenerating" :disabled="shipments.length < 1" color="pink">
        <v-icon>mdi-delete</v-icon>
        <span v-show="smAndUp">Delete</span>
    </v-btn>
</template>

<script lang="ts" setup>
import { bulkDeleteShipments, } from '@/admin/repository/shipment/shipment_repository';
import { defineProps, ref } from 'vue';
import { useNotifier } from 'vuetify-notifier';
import { useDisplay } from 'vuetify';

const props = defineProps<{
    shipments: (string)[],

}>();


const emit = defineEmits<{
    (e: 'deleted', ids: ID[]): void;
}>();

const notifier = useNotifier();
const { smAndUp } = useDisplay();


const isGenerating = ref(false);

async function deleteShipments() {
    try {
        const proceed = await notifier.confirmError({
            title: `Delete ${props.shipments.length} selected shipments?`,
            text: `This operation is not reversible. I hope you know what you are doing.`
        });

        if (!proceed) {
            return;
        }

        isGenerating.value = true;
        const shipmentIds = await bulkDeleteShipments({ shipments: props.shipments, });

        notifier.toastSuccess({
            title: "Successful",
            text: `${(shipmentIds ?? []).length} shipments deleted`
        });

        emit('deleted', shipmentIds);
    }
    catch (err) {
        const message = (err as any).message as string;
        notifier.toastError(`Failed to delete shipments: ${message}`,);
    }
    finally {
        isGenerating.value = false;
    }
}
</script>