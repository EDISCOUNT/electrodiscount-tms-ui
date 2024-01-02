<template>
<v-row class="px-5">
    <BulkImportShipmentAction
    :channel="channel"
    :order-ids="orderIds"
    :fulfilment-type="ShipmentFulfilmentType.PICKUP_AND_DELIVERY"
    import-label="Import Shipment"
    assign-label="Assign Shipment"
    @imported="(...args) => emit('imported',...args)"
    />
    <span class="mx-1"/>
    <BulkImportShipmentAction
    :channel="channel"
    :order-ids="orderIds"
    :fulfilment-type="ShipmentFulfilmentType.DROPSHIPPING"
    import-label="Import Dropship"
    assign-label="Assign Dropship"
    variant="outlined"
    @imported="(...args) => emit('imported',...args)"
    />
</v-row>
</template>

<script lang="ts" setup>
import BulkImportShipmentAction from './BulkImportShipmentAction.vue';
import Channel from "@/model/channel/channel";
import Shipment from "@/model/shipment/shipment";
import ShipmentFulfilmentType from "@/model/shipment/shipment_fulfilment_type";

const props = defineProps<{
    channel: Channel,
    orderIds: string[],
}>();

const emit = defineEmits<{
    // close: () => void,
    (e: 'imported', shipments?: Shipment[]): void,
}>();


</script>