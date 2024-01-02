<template>
    <v-btn @click="() => printManifest()" :loading="isGenerating" color="primary">
        <v-icon>mdi-printer</v-icon>
        <span v-show="smAndUp">Manifest</span>
    </v-btn>
</template>

<script lang="ts" setup>
import { getShipment, updateShipment, generatePacklist, } from '@/admin/repository/shipment/shipment_repository';
import { defineProps, ref } from 'vue';
import { useNotifier } from 'vuetify-notifier';
import { useDisplay } from 'vuetify';

const props = defineProps<{
    shipments: (string)[],
    
}>();


const notifier = useNotifier();
const {smAndUp} = useDisplay();


const isGenerating = ref(false);

async function printManifest() {
    try {
        isGenerating.value = true;
        const { url } = await generatePacklist({ shipments: props.shipments });
        if(url) {
            window.open(url, '_blank');
        }
        else {
            notifier.toastError("Failed to generate packlist");
        }
        // console.log("FETCHED RESULT: ", { url });
    }
    catch (err) {
        const message = (err as any).message as string;
        notifier.toastError(`Failed to generate packlist: ${message}`,);
    }
    finally {
        isGenerating.value = false;
    }
}
</script>