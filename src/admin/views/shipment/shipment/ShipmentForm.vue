<template>
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
                    <v-btn color="primary" :elevation="0" class="mx-2" :loading="loading" variant="outlined">
                        Options
                        <v-icon>mdi-menu-down</v-icon>
                    </v-btn>
                </template>
            </v-card>
        </v-card-title>

        <v-card-text v-if="error" class="text-center">
            <v-alert type="error" dense>{{ error }}</v-alert>
        </v-card-text>
        <v-card-text class="mt-2">
            <v-form ref="form">

                <v-row justify="space-around">
                    <v-col cols="12" md="3">

                        <v-card class="" flat>
                            <v-card-title>
                                Shipment Fulfilment
                            </v-card-title>
                            <v-card-text>
                                <ShipmentFulfilmentForm v-model="data.fulfilment" />
                            </v-card-text>
                        </v-card>

                        <v-card class="fill-height mt-4" flat>
                            <v-card-title>
                                <span>Shipment</span>
                            </v-card-title>
                            <v-card-text>
                                <v-form ref="form">
                                    <v-text-field v-model="data.code" label="Code" variant="outlined"
                                        density="compact"></v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-divider />
                            <v-card-text>
                                <v-textarea v-model="data.description" :rows="4" label="Description" variant="outlined"
                                    density="compact"></v-textarea>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="5">
                        <v-card class="fill-height" min-height="calc(100vh - 100px)"  flat>
                            <template v-if="data.items?.length">
                                <v-card-title>
                                    <span>Shipment Items</span>
                                </v-card-title>
                                <v-card-subtitle>
                                    Products and Packages to be shipped
                                </v-card-subtitle>
                            </template>
                            <v-card-text>
                                <v-card color="transparent" min-height="calc(100vh - 250px)" style="overflow: auto;" flat>
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

                    <v-col cols="12" md="4">

                        <v-card flat>
                            <v-card-text class="pa-2">
                                <v-card height="10px" color="secondary-bg" flat>

                                </v-card>
                                <v-card flat>
                                    <v-card-subtitle>
                                        Select Carrier(Optional)
                                    </v-card-subtitle>
                                    <v-card-text>
                                        <CarrierInput v-model="data.carrier" label=""
                                            placeholder="Start typing to search for carriers..." variant="outlined"
                                            density="compact" outlined />
                                    </v-card-text>
                                </v-card>
                            </v-card-text>

                        </v-card>


                        <v-card class="fill-height mt-4" flat>
                            <v-card-title>
                                <span>Additional Services</span>
                            </v-card-title>
                            <v-card-text>
                                <v-list>
                                    <v-list-item v-for="service in additionalServices.data.value?.items" :key="service.id"
                                        lines="one">
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
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
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

const data = reactive<ShipmentFormData>({
    code: props.shipment?.code ?? '',
    // metadata: props.shipment?.metadata ?? {},
    additionalServices: props.shipment?.additionalServices?.map( x => x.id),
    carrier: props.shipment?.carrier?.id,
    items: props.shipment?.items?.map(item => item.toJson()) ?? [],
    fulfilment: props.shipment?.fulfilment?.toJson(),

});

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