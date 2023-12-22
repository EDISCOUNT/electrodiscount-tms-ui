<template>
    <div v-if="pagination">
        <v-row justify="space-around" class="pl-4">
            <div v-for="(carrier, i) in pagination.items" :key="carrier.id ?? i">
                <v-btn @click="() => createShipment({ carrier })" color="primary" class="mx-2" :elevation="0"
                    :disabled="isImportingShipping || !orderIds.length" variant="flat"
                    :loading="isImportingShipping && carrier.id == choosenCarrier?.id">
                    Send to {{ carrier.name }}
                </v-btn>
            </div>
        </v-row>
    </div>
    <div v-else-if="loading">
        <v-progress-circular indeterminate />
    </div>
    <!-- <v-spacer /> -->
    <v-btn v-if="pagination?.pageInfo.totalItems === 0" @click="() => createShipment()" :loading="isImportingShipping"
        color="primary" :elevation="0" :disabled="!orderIds.length" variant="flat">
        Import Shipment
        <v-icon>mdi-import</v-icon>
    </v-btn>
</template>

<script lang="ts" setup>
import { getPaginatedCarriers } from "@/admin/repository/carrier/carrier_repository";
import { getOrder, bulkImportShipment } from "@/admin/repository/order/order_repository";
import Carrier from "@/model/carrier/carrier";
import Channel from "@/model/channel/channel";
import Order from "@/model/order/order";
import Shipment from "@/model/shipment/shipment";
import useSWRV from "swrv";
import { ref } from "vue";
import { useNotifier } from "vuetify-notifier";

const props = defineProps<{
    channel: Channel,
    orderIds: string[],
    // id: number | string,
    // height?: number | string,
}>();

const emit = defineEmits<{
    // close: () => void,
    (e: 'imported', shipments?: Shipment[]): void,
}>();


const notifier = useNotifier();


const { data: pagination, isValidating: loading, error } = useSWRV(
    () => `/api/admin/carrier/carriers?enabled=true`,
    (url) => getPaginatedCarriers(),
    {
        revalidateOnFocus: false,
        // revalidateOnReconnect: false,
    }
);


const isImportingShipping = ref(false);
const choosenCarrier = ref<Carrier>();
const createShipment = async ({ carrier }: { carrier?: Carrier } = {}) => {
    try {
        choosenCarrier.value = carrier;
        isImportingShipping.value = true;
        await bulkImportShipment(props.orderIds, { channel: props.channel, carrier });
        emit('imported',);
        notifier.toast({
            title: 'Shipments imported',
            text: `${props.orderIds.length} shipments imported successfully`,
        }, 'success');
    }
    catch (err) {
        const message = (err as any)?.response?.data?.message ?? (err as any)?.message ?? 'Error importing shipments';
        notifier.toast({
            title: 'Error importing shipments',
            text: message,


        }, 'error');

        // notifier.alertError(message);
    }
    finally {
        isImportingShipping.value = false;
    }
}


</script>