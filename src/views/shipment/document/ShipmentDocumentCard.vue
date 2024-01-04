<template>
    <v-card color="grey-lighten-4" flat>
        <template v-slot:prepend>
            <v-chip color="primary" size="small">
                {{ label }}
            </v-chip>
        </template>
        <v-card-text>
            <!-- {{ { document } }} -->

            <v-row justify="start">
                <v-col :cols="6" v-for="(attachment, i) in document.attachments" :key="attachment.id">
                    <v-card height="150px" r-color="grey-lighten-5" flat>
                        <v-img :src="resolveFileURL(attachment.src)" />
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>
import ShipmentDocument from '@/model/shipment/shipment_document';
import ShipmentDocumentType from '@/model/shipment/shipment_document_type';
import Shipment from '@/model/shipment/shipment';
import { formatDate, formatMoney } from '@/utils/format'
import { resolveFileURL } from '@/utils/file';
import useSWRV from 'swrv';
import { computed } from 'vue';

const props = defineProps({
    // shipment: {
    //     type: Shipment,
    //     required: true,
    // },
    document: {
        type: ShipmentDocument,
        required: true,
    }
});


const document = computed(() => props.document);

const label = computed(() => {
    switch (document.value?.type) {
        case ShipmentDocumentType.PUC:
            return 'Pickup Confirmation';
        case ShipmentDocumentType.POD:
            return 'Proof of Delivery';
        default:
            return document.value?.type;
            break;
    }
});



</script>