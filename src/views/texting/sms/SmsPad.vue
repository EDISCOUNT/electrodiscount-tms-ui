<template>
    <v-card flat>
        <v-card-text>
            <v-combobox v-model="data.recipients" label="Recipients" placeholder="Enter the sms address" r-variant="plain"
                r-density="compact" multiple>

                <template v-slot:chip="{ item: { raw }, index }">
                    <template v-if="typeof (raw) === 'string'">
                        <v-chip class="px-1" close>
                            <template v-if="raw.length > 0" v-slot:prepend>
                                <v-avatar color="primary">
                                    <span class="text-h6">
                                        {{ raw.slice(0, 1).toUpperCase() }}
                                    </span>
                                </v-avatar>
                            </template>
                            <span class="mx-1">{{ raw }}</span>
                        </v-chip>
                    </template>

                    <template v-if="(raw instanceof Address)">
                        <v-menu width="400px" open-on-hover>
                            <template v-slot:activator="{ props }">
                                <v-chip class="px-1" v-bind="props" close>
                                    <template v-slot:prepend>
                                        <v-avatar color="primary">
                                            <span class="text-h6">
                                                {{ raw.fullName.slice(0, 1).toUpperCase() }}
                                            </span>
                                        </v-avatar>
                                    </template>
                                    <span class="mx-1">{{ raw.fullName }}</span>
                                </v-chip>
                            </template>
                            <v-card flat>
                                <v-card-text>
                                    <v-list-item>
                                        <template v-slot:prepend>
                                            <v-avatar color="primary" :size="50">
                                                <span class="text-h5">
                                                    {{ raw.fullName.slice(0, 1).toUpperCase() }}
                                                </span>
                                            </v-avatar>
                                        </template>
                                        <template v-slot:title>
                                            <span class="text-h5">{{ raw.fullName }}</span>
                                        </template>
                                        <template v-slot:subtitle>
                                            <span>{{ raw.phoneNumber }}</span>
                                        </template>
                                    </v-list-item>
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-btn color="primary" r-:elevation="0">
                                        Open Detail View
                                    </v-btn>
                                    <v-spacer />

                                    <template v-if="raw.phoneNumber">

                                        <v-tooltip>
                                            <template v-slot:activator="{ props }" position="bottom">
                                                <v-btn v-bind="props" :href="`tel:${raw.phoneNumber}`" color="primary"
                                                    :elevation="0" icon>
                                                    <v-icon>mdi-phone</v-icon>
                                                </v-btn>
                                            </template>
                                            <small>Call: {{ raw.phoneNumber }}</small>
                                        </v-tooltip>
                                        <v-tooltip>
                                            <template v-slot:activator="{ props }" position="bottom">
                                                <v-btn v-bind="props" color="primary" :elevation="0" icon>
                                                    <v-icon>mdi-message</v-icon>
                                                </v-btn>
                                            </template>
                                            <small>Send SMS</small>
                                        </v-tooltip>
                                    </template>
                                    <v-tooltip>
                                        <template v-slot:activator="{ props }" location="bottom">
                                            <v-btn v-bind="props" :href="`mailto:${raw.phoneNumber}`" color="primary"
                                                :elevation="0" icon>
                                                <v-icon>mdi-sms</v-icon>
                                            </v-btn>
                                        </template>
                                        <small>Email: {{ raw.phoneNumber }}</small>
                                    </v-tooltip>
                                </v-card-actions>
                            </v-card>
                        </v-menu>

                    </template>
                </template>
            </v-combobox>

            <v-textarea v-model="data.message" :rows="5" label="Messages" variant="outlined"  :counter="160"/>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <!-- <v-switch v-model="data.saveAsTemplate" label="Save as template" inset density="compact" size="x-small"
                color="primary" class="my-0 py-0" /> -->
            <v-spacer />
            <v-btn @click="() => send()" color="primary" :loading="isSending" :elevation="0">
                Send<v-icon>mdi-send</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import Order from '@/model/order/order';
import Address from '@/model/addressing/address';
import SmsMessage, { SmsMessageFormData } from '@/model/texting/message';
import { createSmsMessage } from '@/repository/texting/message_repository';
import { ref, reactive, watch, computed } from 'vue';
import { useNotifier } from 'vuetify-notifier';


const props = defineProps<{
    shipment?: Shipment,
    order?: Order,
    addresses?: (Address | string)[],
}>();

const emit = defineEmits<{
}>();
const notifier = useNotifier();

const fileInput = ref<HTMLInputElement>();
const isSending = ref(false);



const addresses = computed(() => {
    const addresses: (Address | string)[] = [];

    if (props.shipment) {
        const shipment = props.shipment;
        if (shipment.billingAddress) {
            addresses.push(shipment.billingAddress);
        }
        if (shipment.originAddress) {
            addresses.push(shipment.originAddress);
        }
        if (shipment.destinationAddress) {
            addresses.push(shipment.destinationAddress);
        }
    }
    if (props.order) {
        const order = props.order;
        if (order.billingAddress) {
            addresses.push(order.billingAddress);
        }
        if (order.shippingAddress) {
            addresses.push(order.shippingAddress);
        }
    }

    if (props.addresses) {
        addresses.push(...props.addresses.filter(e => !!e));
    }
    return addresses;
});


const data = reactive<SmsMessageFormData>({
    recipients: addresses.value,
    message: (undefined as any) as string,
});


async function send() {
    try {
        isSending.value = true;
        const message = await createSmsMessage(data);
        notifier.toastSuccess("Message sent succesfully!");
    }
    catch (err) {
        const message = (err as any).message as string;
        notifier.toastError(message);
    }
    finally {
        isSending.value = false;
    }
}

</script>