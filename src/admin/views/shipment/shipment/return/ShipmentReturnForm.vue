<template>
    <v-card flat>
        <v-form ref="form">
            <v-card-text class="py-0">
                <v-row justify="space-between">
                    <v-col :col="6" :md="4">
                        <v-card flat>
                            <v-card-title>
                                Pickup Address
                            </v-card-title>
                            <v-card-text>
                                <v-textarea v-model="data.originAddress" variant="outlined" density="compact" :rows="3"
                                    clearable />
                                <!-- <edit-dialog v-model="data.originAddress" :return-value.sync="data.originAddress">
                                    <template v-slot:input>
                                        <v-text-field v-model="data.originAddress" />
                                    </template>
                                    {{ data.originAddress?? shipment.originAddress?.formatted }}
                                </edit-dialog> -->
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col :col="6" :md="4">
                        <v-card flat>
                            <v-card-title>
                                <v-row justify="space-between" class="py-4 px-4">
                                    <v-dialog max-width="500px">
                                        <template v-slot:activator="{ props }">
                                            <v-btn v-bind="props" color="primary" variant="text" :elevation="0">
                                                <v-icon>mdi-warehouse</v-icon>
                                                <span>Select</span>
                                            </v-btn>
                                        </template>
                                        <v-card flat>
                                            <v-card-title>
                                                <span>Select Warehouse</span>
                                            </v-card-title>
                                            <v-card-subtitle>
                                                Select the warehouse where the returned Item should be delivered to
                                            </v-card-subtitle>
                                            <v-card-text>
                                                <StorageObjectInput
                                                    @update:model-value="storage => data.destinationAddress = storage?.address?.formatted"
                                                    variant="outlined" density="compact" clearable />
                                            </v-card-text>
                                            <v-card-actions>

                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                    <span>Delivery Address</span>
                                </v-row>
                            </v-card-title>
                            <v-card-text>
                                <v-textarea v-model="data.destinationAddress" variant="outlined" density="compact" :rows="3"
                                    clearable />
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <!--  -->
                    <!-- <v-col :col="6">
                    </v-col> -->



                </v-row>
            </v-card-text>
            <v-divider />
            <v-card-text>
                <v-row>
                    <v-col :col="12">
                        <v-card flat>
                            <v-card-title>
                                Items
                            </v-card-title>
                            <v-card-text>
                                <v-data-table :headers="headers" :items="data.items" :items-per-page="5" class="elevation-0"
                                    show-select>
                                    <template v-slot:footer>
                                        <span></span>
                                    </template>
                                    <template v-slot:item.sn="{ item, index }">
                                        <span>{{ index + 1 }}</span>
                                    </template>

                                    <template v-slot:item.product="{ item, index }">
                                        <span>{{ shipment.items?.[index]?.product?.name ?? '[No Name]' }}</span>
                                    </template>

                                    <template v-slot:item.reason="{ item }">
                                        <v-text-field v-model="item.reason" variant="outlined" density="compact"
                                            class="mt-4" />
                                    </template>
                                    <template v-slot:item.quantity="{ item, index }">
                                        <v-text-field v-model.number="item.quantity"
                                            :max="shipment.items?.[index]?.quantity ?? Infinity" :min="1" :step="1"
                                            type="number" variant="outlined" density="compact" class="mt-4" />
                                    </template>

                                    <template v-slot:item.handlingResult="{ item }">
                                        <v-select v-model="item.handlingResult" :items="handlingResults" variant="outlined"
                                            density="compact" class="mt-4" mandatory />
                                    </template>


                                    <template v-slot:item.actions="{ item }">
                                        <v-btn color="error" text @click="data.items.splice(data.items.indexOf(item), 1)"
                                            :elevation="0">
                                            Return
                                            <v-icon>mdi-send</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-form>
    </v-card>
</template>

<script lang="ts" setup>
import Product from '@/model/catalog/product';
import Shipment from '@/model/shipment/shipment';
import { AddressFormData } from '@/model/address/address';
import { formatDate } from '@/utils/format';
import { formatDateNamed } from '@/utils/format/date';
import { computed, reactive, onMounted, ref, useAttrs, watch } from 'vue';
import EditDialog from '@/components/Input/EditDialog.vue';
import StorageObjectInput from '../partials/StorageObjectInput.vue';
import Address from '@/model/addressing/address';
import { ShipmentReturnFormData, createReturnShipment } from '@/admin/repository/shipment/shipment_repository';
// import { VForm } from 'vuetify/'

const props = defineProps<{
    shipment: Shipment;
}>();


const form = ref<VForm>();


const data = reactive<ShipmentReturnFormData>({
    // shipment: props.shipment?.id,
    originAddress: props.shipment.destinationAddress?.formatted ?? '',
    destinationAddress: props.shipment.originAddress?.formatted ?? '',
    items: props.shipment.items.map(e => ({
        shipmentItem: e.id,
        // orderItemId: e.orderItem?.id,
        handlingResult: 'RETURN_RECEIVED',
        quantity: e.quantity,
        reason: '',
    }))

});



const headers = [
    {
        key: 'sn',
        title: 'S/N'
    },
    {
        key: 'product',
        title: 'Product',
        minWidth: 400,
    },
    {
        key: 'quantity',
        title: 'Quantity'
    },
    {
        key: 'handlingResult',
        title: 'Handling Result',
        minWidth: 200,
    },
    {
        key: 'reason',
        title: 'Reason',
        minWidth: 250,
    },
    // {
    //     key: 'actions',
    //     title: 'Actions'
    // },
];


async function validate() {
    const { valid, errors } = await form.value!.validate();
    if (!valid) {
        throw new Error(`Form Error: ${errors?.toString()}`)
    }
    return data;
}


defineExpose({
    validate
});


const handlingResults = [
    "RETURN_RECEIVED",
    "EXCHANGE_PRODUCT",
    "RETURN_DOES_NOT_MEET_CONDITIONS",
    "REPAIR_PRODUCT",
    "CUSTOMER_KEEPS_PRODUCT_PAID",
];


</script>