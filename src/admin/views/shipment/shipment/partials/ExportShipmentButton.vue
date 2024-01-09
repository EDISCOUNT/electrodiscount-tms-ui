<template>
    <v-btn @click="() => exportShipments()" :loading="isGenerating" color="primary">
        <v-icon>mdi-export</v-icon>
        <span v-show="smAndUp">Export</span>
    </v-btn>
</template>

<script lang="ts" setup>
import { getShipment, updateShipment, generateExportUrl, } from '@/admin/repository/shipment/shipment_repository';
import { defineProps, ref } from 'vue';
import { useNotifier } from 'vuetify-notifier';
import { useDisplay } from 'vuetify';

const props = defineProps<{
    shipments: (string)[],
    
}>();


const notifier = useNotifier();
const {smAndUp} = useDisplay();


const isGenerating = ref(false);

async function exportShipments() {
    try {
        isGenerating.value = true;
        const { url } = await generateExportUrl({ shipments: props.shipments });
        if(url) {
            window.open(url, '_blank');
        }
        else {
            notifier.toastError("Failed to generate export");
        }
        // console.log("FETCHED RESULT: ", { url });
    }
    catch (err) {
        const message = (err as any).message as string;
        notifier.toastError(`Failed to generate export: ${message}`,);
    }
    finally {
        isGenerating.value = false;
    }
}
</script>