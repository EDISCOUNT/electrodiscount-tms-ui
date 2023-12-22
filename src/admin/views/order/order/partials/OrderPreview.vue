<template>
    <v-card :hight="height" min-height="400px" flat>


        <!-- {{ {order: props.order}  }} -->
        <template v-slot:append>
            <slot name="append">
                <v-btn icon @click="() => close()" variant="flat">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </slot>
        </template>

        <template v-slot:title>
            <slot name="title">
                <template v-if="!loading">
                    <span>Order: </span>
                    <strong>
                        # {{ order.channelOrderId }}
                    </strong>
                </template>
            </slot>
        </template>

        <v-row justify="center" align="center" class="fill-height" v-if="loading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>
        <template v-else-if="order">
            <v-card-text>
                <!-- {{ {order: order} }} -->
                <v-row>
                    <v-col :cols="12" :md="12">
                        <v-card flat>
                            <v-card-title>
                                <span>Order Details</span>
                            </v-card-title>
                            <v-card-text>
                                <v-list>
                                    <div v-for="(item, i) in order.items" :key="item.id ?? i">
                                        <v-list-item lines="three">
                                            <template v-slot:title>
                                                {{ item.product?.name }}
                                            </template>
                                            <template v-slot:subtitle>
                                                {{ item.quantity }} x {{ item.unitPrice }}
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
                            <v-card-text>
                                <address-formatted-view :address="order.shippingAddress" />
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col :cols="12" :md="4">
                        <v-card flat>
                            <v-card-title>
                                Billing Address
                            </v-card-title>
                            <v-card-text>
                                <address-formatted-view :address="order.billingAddress" />
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col :cols="12" :md="4">
                        <v-card color="secondary-bg" flat>

                            <v-card-text>
                                <v-list-item>
                                    <template v-slot:title>
                                        {{ order.total }}
                                    </template>
                                    <template v-slot:subtitle>
                                        Total
                                    </template>
                                </v-list-item>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
            <import-shipment-action :order="order" @imported="(shipment) => onImport(shipment)" />
        </template>

        <v-row justify="center" align="center" class="fill-height" v-else>
            <v-card width="400px" flat>
                <v-card-title>
                    Seems an error occured!
                </v-card-title>
                <v-card-subtitle>
                    Could not fetch order details.
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
import Order from "@/model/order/order";
import { computed, ref } from "vue";
import AddressFormattedView from "@/admin/views/addressing/partials/AddressFormattedView.vue";
import { getOrder, importShipment } from "@/admin/repository/order/order_repository";
import useSWRV from "swrv";
import Shipment from "@/model/shipment/shipment";
import ImportShipmentAction from "../import/ImportShipmentAction.vue";


const props = defineProps<{
    order: Order,
    // id: number | string,
    height?: number | string,
}>();

const emit = defineEmits<{
    // close: () => void,
    (e: 'close'): void,
    (e: 'order:close'): void,
}>();


const { data: order, isValidating: loading, error } = useSWRV(
    () => `/api/admin/channel/channels/${props.order.channel!.id}/orders/${props.order.channelOrderId}`,
    (url) => getOrder(props.order.channelOrderId as string, props.order.channel!.id),
    {
        revalidateOnFocus: false,
        // revalidateOnReconnect: false,
    }
);



const height = computed(() => {
    return props.height ?? undefined;//'400px';
});



function onImport(shipment: Shipment){

    close();
}



function close() {
    emit('close');
}

</script>