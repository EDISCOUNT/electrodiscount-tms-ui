<template>
    <v-card :hight="height" min-height="400px" flat>


        <!-- {{ {shipment: props.shipment}  }} -->
        <template v-slot:append>
            <slot name="append">
                <v-row>
                    <EmailDrawer :shipment="shipment" />
                    <v-spacer />
                    <v-btn icon @click="() => close()" variant="flat">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-row>
            </slot>
        </template>

        <template v-slot:title>
            <slot name="title">
                <template v-if="!loading">
                    <span>Shipment: </span>
                    <strong>
                        # {{ shipment?.code }}
                    </strong>
                </template>
            </slot>
        </template>

        <v-row justify="center" align="center" class="fill-height" v-if="loading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>
        <template v-else-if="shipment">
            <v-card-text>
                <!-- {{ {shipment: shipment} }} -->
                <v-row>
                    <v-col :cols="12" :md="12">
                        <v-card flat>
                            <v-card-title>
                                <span>Shipment Details</span>
                            </v-card-title>
                            <v-card-text>
                                <v-list>
                                    <div v-for="(item, i) in shipment.items" :key="item.id ?? i">
                                        <v-list-item lines="three">
                                            <template v-slot:title>
                                                <span v-if="item.name">
                                                    {{ item.name }}
                                                </span>
                                                <span v-else-if="item.product?.name">
                                                    {{ item.product?.name }}
                                                </span>
                                                <span class="text-grey" v-else>
                                                    N/A
                                                </span>
                                            </template>
                                            <template v-slot:subtitle>
                                                {{ item.quantity }}
                                                <!-- x {{ item.prod }} -->
                                            </template>
                                        </v-list-item>
                                    </div>
                                </v-list>
                            </v-card-text>
                        </v-card>
                    </v-col>

                </v-row>
            </v-card-text>
            <v-card-text>
                <v-row>
                    <v-col :cols="12" :md="4">
                        <v-card flat>
                            <v-card-title>
                                Shipping Address
                            </v-card-title>
                            <v-card-text v-if="shipment.destinationAddress">
                                <address-formatted-view :address="shipment.destinationAddress" />
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col :cols="12" :md="4">
                        <v-card flat>
                            <v-card-title>
                                Billing Address
                            </v-card-title>
                            <v-card-text v-if="shipment.billingAddress">
                                <address-formatted-view :address="shipment.billingAddress" />
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col :cols="12" :md="6">
                        <v-card color="secondary-bg" flat>

                            <v-card-text>
                                <v-list-item>
                                    <template v-slot:title>
                                        {{ shipment.channel?.name ?? '[NO CHANNEL NAME]' }}
                                    </template>
                                    <template v-slot:subtitle>
                                        Channel
                                    </template>
                                </v-list-item>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col :cols="12" :md="6">
                        <v-card-actions>
                            <v-btn :to="{
                                name: 'admin:shipment:show',
                                params: {
                                    id: shipment.id,
                                }
                            }" variant="flat" color="primary">
                                View
                                <v-icon>mdi-arrow-right</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-card-text>
        </template>

        <v-row justify="center" align="center" class="fill-height" v-else>
            <v-card width="400px" flat>
                <v-card-title>
                    Seems an error occured!
                </v-card-title>
                <v-card-subtitle>
                    Could not fetch shipment details.
                </v-card-subtitle>
                <v-card-text v-if="error">
                    <v-alert type="error">
                        {{ error }}
                    </v-alert>
                </v-card-text>
            </v-card>

        </v-row>
    </v-card>
</template>

<script lang="ts" setup>
import Shipment from "@/model/shipment/shipment";
import { computed, ref } from "vue";
import AddressFormattedView from "@/admin/views/addressing/partials/AddressFormattedView.vue";
import { getShipment, } from "@/admin/repository/shipment/shipment_repository";
import useSWRV from "swrv";
import EmailDrawer from '@/views/mailing/email/EmailDrawer.vue';


const props = defineProps<{
    shipment: Shipment,
    // id: number | string,
    height?: number | string,
}>();

const emit = defineEmits<{
    // close: () => void,
    (e: 'close'): void,
    (e: 'shipment:close'): void,
}>();


const { data: shipment, isValidating: loading, error } = useSWRV(
    () => `/api/admin/shipment/shipments/${props.shipment.id!}`,
    (url) => getShipment(props.shipment.id as any),
    {
        revalidateOnFocus: false,
        // revalidateOnReconnect: false,
    }
);



const height = computed(() => {
    return props.height ?? undefined;//'400px';
});



function onImport(shipment?: Shipment | Shipment[]) {

    close();
}



function close() {
    emit('close');
}

</script>