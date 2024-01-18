<template>
    <v-btn @click="() => returnShipments()" :loading="isGenerating" :disabled="shipments.length < 1" color="primary">
        <v-icon>mdi-undo</v-icon>
        <span v-show="smAndUp">Return</span>
        <v-divider class="my-0 ml-1" vertical/>
        <v-menu>
            <template v-slot:activator="{props}">
                <v-icon v-bind="props" @click.stop="() => undefined">mdi-chevron-down</v-icon>
            </template>
            <v-list>
                <v-list-item @click.stop="() => returnShipments(ShipmentReturnType.EXCHANGE_ORDER)" >
                    <template v-slot:prepend>
                        <v-icon>mdi-transfer</v-icon>
                    </template>
                    <template v-slot:title>
                        Return Exchange
                    </template>
                    <template v-slot:subtitle>
                        <span>
                            Create an exhange order instead
                        </span>
                    </template>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-btn>
</template>

<script lang="ts" setup>
import { bulkReturnShipments, } from '@/admin/repository/shipment/shipment_repository';
import { defineProps, ref } from 'vue';
import { useNotifier } from 'vuetify-notifier';
import { useDisplay } from 'vuetify';
import ShipmentReturnType from '@/model/shipment/shipment_return_type';

const props = defineProps<{
    shipments: (string)[],

}>();

const emit = defineEmits<{
    (e: 'returned', ids: ID[]): void;
}>();


const notifier = useNotifier();
const { smAndUp } = useDisplay();


const isGenerating = ref(false);

async function returnShipments(fulfilmentType?: ShipmentReturnType) {
    try {
        const proceed = await notifier.confirmInfo({
            title: `Return ${props.shipments.length} selected shipments?`,
            text: `This will create a new return shipment for each selected shipment`
        });

        if (!proceed) {
            return;
        }

        isGenerating.value = true;
        const shipmentIds = await bulkReturnShipments({ shipments: props.shipments, fulfilmentType });

        notifier.toastSuccess({
            title: "Successful",
            text: `${(shipmentIds ?? []).length} shipments returned`
        });

        emit('returned', shipmentIds);
    }
    catch (err) {
        const message = (err as any).message as string;
        notifier.toastError(`Failed to generate returns: ${message}`,);
    }
    finally {
        isGenerating.value = false;
    }
}
</script>