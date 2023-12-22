<template>
    <v-card-actions class="px-4 justify-center">

        <div v-if="pagination">
            <div v-for="(carrier, i) in pagination.items" :key="carrier.id ?? i">
                <v-btn @click="() => createShipment({ carrier })" color="primary" class="mx-2" :elevation="0"
                    :disabled="isImportingShipping" variant="flat"
                    :loading="isImportingShipping && carrier.id == choosenCarrier?.id">
                    Send to {{ carrier.name }}
                </v-btn>
            </div>
        </div>
        <div v-else-if="loading">
            <v-progress-circular indeterminate />
        </div>
        <!-- <v-spacer /> -->
        <v-btn v-if="pagination?.pageInfo.totalItems === 0" @click="() => createShipment()" :loading="isImportingShipping"
            color="primary" :elevation="0" variant="flat">
            Import Shipment
            <v-icon>mdi-import</v-icon>
        </v-btn>
    </v-card-actions>
</template>

<script lang="ts" setup>
import { getPaginatedCarriers } from "@/admin/repository/carrier/carrier_repository";
import { getOrder, importShipment } from "@/admin/repository/order/order_repository";
import Carrier from "@/model/carrier/carrier";
import Order from "@/model/order/order";
import Shipment from "@/model/shipment/shipment";
import useSWRV from "swrv";
import { ref } from "vue";
import { useNotifier } from "vuetify-notifier";

const props = defineProps<{
    order: Order,
    // id: number | string,
    // height?: number | string,
}>();

const emit = defineEmits<{
    // close: () => void,
    (e: 'imported', shipment: Shipment): void,
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
        const shipment = await importShipment(props.order,{carrier});
        emit('imported', shipment);
        notifier.toast({
            title: 'Shipment imported',
            text: `Shipment imported successfully`,
            // color: 'success',
        }, 'success');
    }
    catch (err) {
        throw err;
    }
    finally {
        isImportingShipping.value = false;
    }
}


</script>