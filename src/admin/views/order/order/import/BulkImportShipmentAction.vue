<template>
    <div>
        <v-row justify="space-around" class="pl-4">

            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="primary" class="mx-2" :elevation="0"
                        :disabled="isImportingShipping || !orderIds.length" variant="flat" :loading="isImportingShipping">
                        Assign Carrier
                        <v-icon>mdi-menu-down</v-icon>
                    </v-btn>
                </template>
                <v-card class="pt-3" min-width="300px" flat>
                    <v-card-text r-class="pa-0">
                        <v-list v-if="pagination">
                            <div v-for="(carrier, i) in pagination.items" :key="carrier.id ?? i">
                                <v-list-item @click="() => createShipment({ carrier })" color="primary" class="mx-2"
                                    :elevation="0" :disabled="isImportingShipping || !orderIds.length" variant="flat"
                                    :loading="isImportingShipping && carrier.id == choosenCarrier?.id">
                                    <template v-slot:prepend>
                                        <v-avatar v-if="carrier.logo">
                                            <v-img :src="carrier.logo" />
                                        </v-avatar>

                                        <v-avatar color="primary" v-else>
                                            <v-icon>mdi-truck-delivery</v-icon>
                                        </v-avatar>
                                    </template>
                                    <template v-slot:title>
                                        {{ carrier.name }}
                                    </template>
                                    <template v-slot:subtitle>
                                        {{ carrier.code }}
                                    </template>
                                </v-list-item>
                                <v-divider v-if="i < (pagination.items.length - 1)" />
                            </div>
                        </v-list>

                        <v-row justify="center" align="center" class="fill-height" v-else-if="loading">
                            <v-progress-circular indeterminate />
                        </v-row>
                        
                    </v-card-text>
                    <!-- <v-card-text r-class="px-0">
                        <v-row>
                            <v-col>
                                <v-divider />
                            </v-col>
                            <v-col>OR</v-col>
                            <v-col>
                                <v-divider />
                            </v-col>
                        </v-row>
                    </v-card-text> -->
                    <v-divider />
                    <!-- 
                    <v-card-subtitle>
                        Import and Select Carrier
                    </v-card-subtitle> -->

                    <v-card-actions class="px-5">
                        <v-btn @click="() => createShipment()" :loading="isImportingShipping" color="primary" :elevation="0"
                            :disabled="!orderIds.length" variant="flat" block>
                            Import Shipment
                            <v-icon>mdi-import</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>

        </v-row>
    </div>
    <v-btn v-if="pagination?.pageInfo.totalItems === 0" @click="() => createShipment()" :loading="isImportingShipping"
        color="primary" :elevation="0" :disabled="!orderIds.length" variant="flat">
        Import Shipment
        <v-icon>mdi-import</v-icon>
    </v-btn>
</template>

<script lang="ts" setup>
import { getPaginatedCarriers } from "@/admin/repository/carrier/carrier_repository";
import { getOrder, bulkImportShipment } from "@/admin/repository/order/order_repository";
import Carrier from "@/model/carrier/carrier";
import Channel from "@/model/channel/channel";
import Order from "@/model/order/order";
import Shipment from "@/model/shipment/shipment";
import useSWRV from "swrv";
import { ref } from "vue";
import { useNotifier } from "vuetify-notifier";

const props = defineProps<{
    channel: Channel,
    orderIds: string[],
    // id: number | string,
    // height?: number | string,
}>();

const emit = defineEmits<{
    // close: () => void,
    (e: 'imported', shipments?: Shipment[]): void,
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
        await bulkImportShipment(props.orderIds, { channel: props.channel, carrier });
        emit('imported',);
        notifier.toast({
            title: 'Shipments imported',
            text: `${props.orderIds.length} shipments imported successfully`,
        }, 'success');
    }
    catch (err) {
        const message = (err as any)?.response?.data?.message ?? (err as any)?.message ?? 'Error importing shipments';
        notifier.toast({
            title: 'Error importing shipments',
            text: message,


        }, 'error');

        // notifier.alertError(message);
    }
    finally {
        isImportingShipping.value = false;
    }
}


</script>