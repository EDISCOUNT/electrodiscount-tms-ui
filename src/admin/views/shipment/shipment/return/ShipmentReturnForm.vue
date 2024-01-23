<template>
    <v-card flat>
        <!-- {{ {items: shipment.items.map((e) => ({...e, product: undefined}))} }} -->
        <!-- {{ { selectedItems } }} -->
        <v-form ref="form">
            <v-card-text class="py-0">
                <v-row justify="space-between">
                    <v-col :col="6" :md="4">
                        <v-card flat>
                            <v-card-title>
                                Pickup Address
                            </v-card-title>
                            <v-card-text>
                                <EditAddressDialog v-model="data.originAddress">
                                </EditAddressDialog>
                                <!-- <v-textarea v-model="data.originAddress" variant="outlined" density="compact" :rows="3"
                                    clearable /> -->
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
                                <v-row justify="space-between" class="py-3 px-4">
                                    <span>Delivery Address</span>
                                    <v-dialog max-width="500px">
                                        <template v-slot:activator="{ props }">
                                            <v-btn v-bind="props" color="primary" variant="text" size="small"
                                                :elevation="0">
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
                                                <StorageObjectInput v-model="storage"
                                                    @update:model-value="storage => onSelectStorage(storage)"
                                                    variant="outlined" density="compact" clearable />
                                            </v-card-text>
                                            <!-- <v-card-actions>

                                            </v-card-actions> -->
                                        </v-card>
                                    </v-dialog>
                                </v-row>
                            </v-card-title>
                            <v-card-text>

                                <EditAddressDialog v-model="data.destinationAddress" label="Edit Drop off Location">
                                </EditAddressDialog>
                                <!-- <v-textarea v-model="data.destinationAddress" variant="outlined" density="compact" :rows="3"
                                    clearable /> -->
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <!--  -->
                    <!-- <v-col :col="6">
                    </v-col> -->

                    <v-col :col="6" :md="4">
                        <v-card flat>
                            <v-card-title>
                                Return Type
                            </v-card-title>
                            <!-- <v-card-subtitle>
                                Select return type
                            </v-card-subtitle> -->
                            <v-card-text>
                                <v-select v-model="data.fulfilmentType" :items="[
                                    'RETURN_ORDER',
                                    'EXCHANGE_ORDER',
                                ]" label="Return Type" placeholder="Select return type" variant="outlined"
                                    density="compact" />
                            </v-card-text>
                        </v-card>
                    </v-col>



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
                                <v-data-table v-model="selectedItems" :headers="(headers as any)" :items="data.items"
                                    :items-per-page="5" class="elevation-0" item-value="shipmentItem" show-select>
                                    <!-- <template v-slot:footer>
                                        <span></span>
                                    </template> -->
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
                                        <v-text-field v-model.number="item.quantity" :rules="[
                                            v => !!v || 'This field is required',
                                            v => !v || v <= (shipment.items?.[index]?.quantity ?? 1) || 'This field is invalid'
                                        ]" :max="shipment.items?.[index]?.quantity ?? 1" :min="1" :step="1"
                                            type="number" variant="outlined" density="compact" class="mt-4" />
                                    </template>

                                    <template v-slot:item.handlingResult="{ item }">
                                        <v-select v-model="item.handlingResult" :items="handlingResults" variant="outlined"
                                            density="compact" class="mt-4" mandatory />
                                    </template>


                                    <template v-slot:item.actions="{ item }">
                                        <v-btn color="error" @click="data.items.splice(data.items.indexOf(item), 1)"
                                            :elevation="0">
                                            Return
                                            <v-icon>mdi-send</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table>
                                <v-divider class="my-2" />
                                <v-card-text>
                                    <v-row justify="end">
                                        <v-col :cols="12" :md="4">
                                            <CarrierInput v-model="data.carrier" label="Carrier"
                                                placeholder="Start typing to search for carriers..." variant="outlined"
                                                density="compact" />
                                        </v-col>
                                        <v-col :cols="12" :md="4">
                                            <StorageInput v-model="data.storage" label="Warehouse"
                                                placeholder="Start typing to search for storages..." variant="outlined"
                                                density="compact" />
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card-text>
                            <!-- <v-card-text>
                                <v-row justify="end">
                                    <v-col :cols="12" :md="4">
                                        <CarrierInput v-model="data.carrier" />
                                    </v-col>
                                    <v-col :cols="12" :md="4">
                                        <StorageInput v-model="data.storage" />
                                    </v-col>
                                </v-row>
                            </v-card-text> -->
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
import ShipmentReturnType from '@/model/shipment/shipment_return_type';
import ShipmentItem from '@/model/shipment/shipment_item';
import Storage from '@/model/inventory/storage';
import { AddressFormData } from '@/model/addressing/address';
import { formatDate } from '@/utils/format';
import { formatDateNamed } from '@/utils/format/date';
import { computed, reactive, onMounted, ref, useAttrs, watch } from 'vue';
import EditDialog from '@/components/Input/EditDialog.vue';
import StorageObjectInput from '../partials/StorageObjectInput.vue';
import EditAddressDialog from '../partials/EditAddressDialog.vue';
import Address from '@/model/addressing/address';
import { ShipmentReturnFormData, createReturnShipment } from '@/admin/repository/shipment/shipment_repository';
import { VForm } from 'vuetify/lib/components/index.mjs';
import CarrierInput from '../partials/CarrierInput.vue';
import StorageInput from '../partials/StorageInput.vue';

const props = defineProps<{
    shipment: Shipment;
    selected?: string[];
}>();

const emit = defineEmits<{
    (e: 'update:selected', value: string[]): void;
}>()


const storage = ref(props.shipment.storage);
const form = ref<VForm>();


const data = reactive<ShipmentReturnFormData>({
    // shipment: props.shipment?.id,
    storage: storage.value?.id,
    carrier: props.shipment.carrier?.id,
    fulfilmentType: ShipmentReturnType.RETURN_ORDER,
    originAddress: props.shipment.destinationAddress?.toJson(),
    destinationAddress: props.shipment.originAddress?.toJson(),
    items: props.shipment.items.map(e => ({
        shipmentItem: e.id!,
        // orderItemId: e.orderItem?.id,
        handlingResult: 'RETURN_RECEIVED',
        quantity: e.quantity,
        reason: '',
    }))

});

const selectedItems = ref<string[]>(props.selected ?? props.shipment.items.map(({ id }: ShipmentItem) => id as string));// 



watch(
    selectedItems,
    (selected) => emit('update:selected', selected)
);

watch(
    () => props.selected,
    (selected) => selectedItems.value = selected ?? [],
);


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
    const out = { ...data };
    out.items = out.items.filter(item => selectedItems.value.includes(item.shipmentItem));
    return out;
}


function onSelectStorage(storage?: Storage) {
    data.destinationAddress = storage?.address?.toJson() ?? {};
    data.storage = storage?.id;
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