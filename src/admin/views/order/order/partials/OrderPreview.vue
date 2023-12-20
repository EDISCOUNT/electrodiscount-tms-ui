<template>
    <v-card :hight="height" flat>
        <template v-slot:title>
            <slot name="title">
                <span>Order: </span>
                <strong>
                    # {{ order.channelOrderId }}
                </strong>
            </slot>
        </template>

        <template v-slot:append>
            <slot name="append">
                <v-btn icon @click="() => close()" variant="flat">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </slot>
        </template>

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
        <v-card-actions class="px-4">
            <v-spacer />
            <v-btn @click="() => importShipping()" :loading="isImportingShipping" color="primary" :elevation="0"
                variant="flat">
                Import Shipment
                <v-icon>mdi-import</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import Order from "@/model/order/order";
import { computed, ref } from "vue";
import AddressFormattedView from "@/admin/views/addressing/partials/AddressFormattedView.vue";
import { importShipment } from "@/admin/repository/order/order_repository";


const props = defineProps<{
    order: Order,
    height?: number | string,
}>();

const emit = defineEmits<{
    // close: () => void,
    (e: 'close'): void,
    (e: 'order:close'): void,
}>();


const height = computed(() => {
    return props.height ?? undefined;//'400px';
});




const isImportingShipping = ref(false);
const importShipping = async () => {
    try {
        isImportingShipping.value = true;
        await importShipment(props.order);
        emit('order:close');
    }
    catch (err) {
        throw err;
    }
    finally {
        isImportingShipping.value = false;
    }
}




function close() {
    emit('close');
}

</script>