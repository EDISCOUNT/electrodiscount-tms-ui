<template>
    <v-form ref="form">
        <v-card color="transparent" r-width="1000px" flat>
            <v-card-title>
                <v-card flat>
                    <template v-slot:prepend>
                        <v-btn @click="() => $router.go(-1)" :elevation="0" icon>
                            <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                    </template>
                    <template v-slot:title>
                        <slot name="title">
                            <span>Shipment Form</span>
                        </slot>
                    </template>
                    <template v-slot:append>
                        <v-btn color="primary" @click="() => save()" variant="flat" :elevation="0" :loading="loading">
                            <v-icon>mdi-content-save</v-icon>
                            Save
                        </v-btn>
                        <v-btn v-if="shipment" :to="{ name: 'admin:shipment:show', params: { id: shipment.id } }"
                            color="primary" :elevation="0" class="mx-2" variant="outlined">
                            View
                            <v-icon>mdi-arrow-right</v-icon>
                        </v-btn>
                        <!-- <v-btn color="primary" :elevation="0" class="mx-2" :loading="loading" variant="outlined">
                            Options
                            <v-icon>mdi-menu-down</v-icon>
                        </v-btn> -->
                    </template>
                </v-card>
            </v-card-title>
            <!-- <v-divider /> -->

            <v-card-text v-if="error" class="text-center">
                <v-alert type="error" dense>{{ error }}</v-alert>
            </v-card-text>
            <v-card-text class="mt-2">
                <v-form ref="form">


                    <v-row justify="space-around">
                        <v-col cols="12" md="8">
                            <v-card class="fill-height" flat>
                                <template v-slot:prepend>
                                    <v-icon size="large">mdi-package</v-icon>
                                    <!-- mdi-package-variant-closed -->
                                </template>
                                <template v-slot:title>
                                    <span>Basic Information</span>
                                </template>
                                <v-divider />
                                <v-card-text>
                                    <v-form ref="form">
                                        <v-row>
                                            <v-col cols="12" md="6">
                                                <v-text-field v-model="data.code" label="Code" variant="outlined"
                                                    density="compact"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-select v-model="data.fulfilmentType" label="Fulfilment Type"
                                                    variant="outlined" density="compact" :items="[
                                                        'PICKUP_AND_DELIVERY',
                                                        'DROPSHIPPING',
                                                        'RETURN_ORDER',
                                                        'EXCHANGE_ORDER',
                                                    ]"></v-select>
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <v-text-field v-model="data.netWeight" label="Net Weight" variant="outlined"
                                                    density="compact" append-inner-icon="mdi-weight"
                                                    type="number"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-text-field v-model="data.volumetricWeight" label="Volumetric Weight"
                                                    variant="outlined" density="compact" append-inner-icon="mdi-weight"
                                                    type="number" :elevation="0" filled></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <v-card :color="inlineBg" flat>
                                                    <v-card-title>
                                                        Dimension
                                                    </v-card-title>
                                                    <v-card-text>
                                                        <DimensionInput v-model="data.dimension" />
                                                    </v-card-text>
                                                </v-card>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-text-field v-model="data.channelOrderId" label="Order ID(Optional)"
                                                    placeholder="Enter the Order Id"
                                                    hint="Enter the ID of the order on the channel where the corresponding order was placed"
                                                    variant="outlined" density="compact"></v-text-field>

                                                <v-row>
                                                    <v-col :cols="4">
                                                        <v-combobox v-model="data.codCurrency" label="Currency"
                                                            variant="outlined" density="compact"
                                                            append-inner-icon="mdi-currency-usd"
                                                            :items="['USD', 'GBP', 'EUR']"></v-combobox>
                                                    </v-col>
                                                    <v-col :cols="8">
                                                        <v-text-field v-model="data.codAmount" label="COD Amount"
                                                            variant="outlined" density="compact"
                                                            append-inner-icon="mdi-currency-usd"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-col>

                                        </v-row>
                                    </v-form>
                                </v-card-text>
                            </v-card>

                        </v-col>

                        <v-col cols="12" md="4">
                            <v-card class="fill-height" flat>
                                <template v-slot:prepend>
                                    <v-icon size="large">mdi-clock</v-icon>
                                </template>
                                <template v-slot:title>
                                    <span> Shipment Fulfilment</span>
                                </template>
                                <v-divider />
                                <v-card-text>
                                    <ShipmentFulfilmentForm v-model="data.fulfilment" />
                                    <!-- <v-divider class="my-3" /> -->
                                    <v-menu :close-on-content-click="false">
                                        <template v-slot:activator="{ props }">
                                            <v-text-field v-model="data.bookedAt" v-bind="props" label="Booking Date"
                                                :placeholder="new Date().toLocaleDateString()" variant="outlined"
                                                density="compact" readonly />
                                        </template>
                                        <v-date-picker v-model="data.bookedAt" label="Booking Date" variant="outlined"
                                            density="compact"></v-date-picker>
                                    </v-menu>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>


                    <v-row>
                        <v-col cols="12" md="6">
                            <v-card class="fill-height" flat>
                                <template v-slot:prepend>
                                    <v-icon size="large">mdi-account</v-icon>
                                </template>
                                <template v-slot:title>
                                    <span>Shipper Info</span>
                                </template>
                                <v-divider />
                                <v-card-text class="pa-0">
                                    <AddressForm v-model="data.originAddress" />
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-card class="fill-height" flat>
                                <template v-slot:prepend>
                                    <v-icon size="large">mdi-account</v-icon>
                                </template>
                                <template v-slot:title>
                                    <span>Consignee Info</span>
                                </template>
                                <v-divider />
                                <v-card-text class="pa-0">
                                    <AddressForm v-model="data.destinationAddress" />
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-row justify="space-around">
                        <v-col cols="12" md="3" v-if="false">

                            <v-card class="fill-height" flat>
                                <v-card-title>
                                    <span>Shipment</span>
                                </v-card-title>
                                <!-- <v-card-text>
                                    <v-text-field v-model="data.code" label="Code" variant="outlined"
                                        density="compact"></v-text-field>
                                </v-card-text>
                                <v-divider /> -->
                                <v-card-text>
                                    <v-textarea v-model="data.deliveryNote" :rows="4" label="Description" variant="outlined"
                                        density="compact" clearable></v-textarea>
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="7">
                            <v-card class="fill-height" min-height="calc(100vh - 100px)" flat>
                                <v-divider class="d-sm-none" />
                                <template v-if="data.items?.length">
                                    <v-card-title>
                                        <span>Shipment Items</span>
                                    </v-card-title>
                                    <v-card-subtitle>
                                        Products and Packages to be shipped
                                    </v-card-subtitle>
                                </template>
                                <v-card-text>
                                    <v-card color="transparent" min-height="calc(100vh - 250px)" style="overflow: auto;"
                                        flat>
                                        <div v-if="data.items?.length">
                                            <div v-for="(item, i) in data.items" :key="i">
                                                <v-card variant="outlined" class="ma-3" flat>
                                                    <v-card-text>
                                                        <flat-shipment-item-form v-model="data.items[i]" />
                                                    </v-card-text>
                                                    <v-card-actions class="px-5 mx-5">
                                                        <v-spacer />
                                                        <v-btn @click="() => data.items?.splice(i, 1)" variant="outlined"
                                                            color="red" :elevation="0">
                                                            <v-icon>mdi-delete</v-icon>
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </div>
                                        </div>
                                        <v-card height="calc(100vh - 250px)" flat v-else>
                                            <v-row justify="center" align="center" class="fill-height">
                                                <v-card flat>
                                                    <v-card-title class="text-center">
                                                        Not Products
                                                    </v-card-title>
                                                    <v-card-subtitle class="text-center">
                                                        Please enter of select producst to ship
                                                    </v-card-subtitle>
                                                    <v-card-actions>
                                                        <v-row justify="center">
                                                            <v-btn @click="() => addItem()" color="primary" variant="flat"
                                                                :elevation="0" rounded>
                                                                <v-icon>mdi-plus-circle</v-icon>
                                                                Add
                                                            </v-btn>
                                                        </v-row>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-row>
                                        </v-card>
                                    </v-card>
                                </v-card-text>
                                <v-card-actions v-if="data.items?.length" class="px-5">
                                    <v-spacer />
                                    <v-btn @click="() => addItem()" color="primary" :elevation="0">
                                        <v-icon>mdi-plus-circle</v-icon>
                                        Add
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="5">

                            <v-card flat>
                                <v-card-text class="pa-2">
                                    <v-card height="0px" color="secondary-bg" flat>

                                    </v-card>
                                    <v-card flat>
                                        <template v-slot:title>
                                            <span> Config and fulfilment</span>
                                        </template>
                                        <v-card-subtitle>
                                            Select Carrier, channel and warehouse
                                        </v-card-subtitle>
                                        <v-card-text>
                                            <CarrierInput v-model="data.carrier" label=""
                                                placeholder="Start typing to search for carriers..." variant="outlined"
                                                density="compact" outlined />

                                            <ChannelInput v-model="data.channel" label=""
                                                placeholder="Start typing to search for Channels..." variant="outlined"
                                                density="compact" outlined />

                                            <StorageInput v-model="data.storage" label=""
                                                placeholder="Start typing to search for Storages..." variant="outlined"
                                                density="compact" outlined />
                                        </v-card-text>
                                    </v-card>
                                </v-card-text>

                            </v-card>


                            <v-card class="mt-4" flat>
                                <v-card-title>
                                    <span>Additional Services</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-list>
                                        <v-list-item v-for="service in additionalServices.data.value?.items"
                                            :key="service.id" lines="one">
                                            <template v-slot:append>
                                                <v-switch v-model="data.additionalServices" :value="service.id"
                                                    :disabled="!service.enabled" density="compact" color="primary" multiple
                                                    inset />
                                            </template>
                                            <template v-slot:title>
                                                {{ service.title }}
                                            </template>
                                            <template v-slot:subtitle>
                                                {{ service.shortDescription ?? service.code }}
                                            </template>
                                        </v-list-item>
                                    </v-list>
                                </v-card-text>
                            </v-card>

                            <v-card class="fill-height mt-4" flat>
                                <v-card-title>
                                    Delivery Note
                                </v-card-title>
                                <v-card-text>
                                    <v-textarea v-model="data.deliveryNote" :rows="8" label="Delivery Note"
                                        placeholder="Enter a not to appear on Manifest/Packlist" variant="outlined"
                                        density="compact" clearable></v-textarea>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-form>
</template>
<script lang="ts" setup>
import { getPaginatedAdditionalServices } from '@/admin/repository/order/additional_service_repository';
import Shipment, { ShipmentFormData } from '@/model/shipment/shipment';
import useSWRV from 'swrv';
import { computed, defineProps, reactive, ref } from "vue";
// import { useConfirm, useSnackbar } from 'vuetify-use-dialog';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import FlatShipmentItemForm from './partials/FlatShipmentItemForm.vue';
import ShipmentFulfilmentForm from './partials/ShipmentFulfilmentForm.vue';
import CarrierInput from './partials/CarrierInput.vue';
import ChannelInput from './partials/ChannelInput.vue';
import StorageInput from './partials/StorageInput.vue';
import DimensionInput from './partials/DimensionInput.vue';
import AddressForm from './partials/AddressForm.vue';
import { useColorScheme } from '@/utils/color';

const props = defineProps<{
    type?: string;
    shipment?: Shipment;
    loading?: boolean;
    height?: number | string;

}>();

const emit = defineEmits<{
    (e: 'save', data: ShipmentFormData): void,
}>();

// const createConfirm = useConfirm()
// const createSnackbar = useSnackbar();

const { xs, smAndDown, mdAndUp } = useDisplay();
const { secondaryBg, inlineBg } = useColorScheme();


const additionalServices = useSWRV(
    () => `/api/admin/order/additional_services`,
    () => getPaginatedAdditionalServices(),
    {
        refreshInterval: 0,
        revalidateOnFocus: false,
        // revalidateOnReconnect: false,
    }
)


const height = computed(() => props.height ?? (xs.value ? '100%' : '100vh'));

const data = reactive<ShipmentFormData>(props.shipment?.toJson() ?? { items: [] });
// ShipmentItemFormData
const form = ref<VForm>();
const error = ref<string>();



function addItem() {
    if (!data.items) {
        data.items = [];
    }
    data.items.push({
        quantity: 1,
        product: undefined,
        // metadata: {},
    });
}



async function save() {
    try {
        error.value = undefined;
        const { valid, errors } = await form.value!.validate();
        if (!valid) {
            throw new Error(errors.toString());
        }
        emit('save', data);
    }
    catch (err) {
        const text = (err as any).message as string;
        // createSnackbar({ text });
        // error.value = text;
    }
    finally {

    }

}


</script>