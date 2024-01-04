<template>
    <v-card :loading="loading" flat>
        <v-card-text v-if="error">
            <v-alert type="error">
                {{ error }}
            </v-alert>
        </v-card-text>
        <v-card-text>
            
            <v-row justify="start">
                <v-col v-for="(document,i) in documents" :key="document.id" :cols="12" :sm="6">
                    <ShipmentDocumentCard :document="document"/>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-row justify="space-around" class="pa-5">
                <v-btn color="primary" rounded width="200px" variant="flat">
                    Message Driver
                    <v-icon class="mx-4">mdi-message</v-icon>
                </v-btn>
                <v-btn color="grey-lighten-3" variant="flat">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </v-row>
        </v-card-actions>
    </v-card>
</template>
<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import ShipmentStatus from '@/model/shipment/shipment_status';
import { formatDate, formatMoney } from '@/utils/format'
import ShipmentDocumentType from "@/model/shipment/shipment_document_type";
import { getShipmentDocumentConnection } from '@/repository/shipment/shipment_document';
import ShipmentDocumentCard from './ShipmentDocumentCard.vue';
import useSWRV from 'swrv';
import { computed } from 'vue';

const props = defineProps({
    shipment: {
        type: Shipment,
        required: true,
    }
});


const { data: document_connection, isValidating: loading, error } = useSWRV(
    () => `/api/shipments/${props.shipment.id}/documents`,
    () => getShipmentDocumentConnection(props)
)

const documents = computed(() => document_connection.value?.edges?.map(({ node }) => node));

</script>