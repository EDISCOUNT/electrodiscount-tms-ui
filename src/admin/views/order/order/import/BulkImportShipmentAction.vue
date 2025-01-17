<template>
    <div v-if="(pagination?.pageInfo.totalItems ?? 0) > 0">
        <v-row justify="space-around" class="pl-4">

            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="{ ...props, ...attrs }" color="primary" class="mx-2" :elevation="0"
                        :disabled="isImportingShipping || !orderIds.length" variant="flat" :loading="isImportingShipping">
                        {{ assignLabel ?? 'Assign Carrier' }}
                        <v-icon>mdi-menu-down</v-icon>
                    </v-btn>
                </template>
                <v-card class="pt-3" min-width="300px" flat>

                    <v-card-actions class="px-5">
                        <v-btn @click="() => createShipment()" :loading="isImportingShipping" color="primary" :elevation="0"
                            :disabled="!orderIds.length" variant="flat" v-bind="attrs" block>
                            {{ importLabel ?? 'Import Shipment' }}
                            <v-icon>mdi-import</v-icon>
                        </v-btn>
                    </v-card-actions>
                    <v-divider/>
                    <v-card-text class="r-py-0 pb-0">
                        <v-row justify="center" align="center">
                            <v-switch inset v-model="notifyCarrier" label="Notify Carrier" color="primary" class="mx-5" r-hint="Notify the carrier by email of their new assignment"
                                @click.stop="() => null" />
                        </v-row>
                    </v-card-text>
                    <v-divider/>
                    <v-card-text class="pt-0-r">
                        <v-card-subtitle class="pt-0 mt-0">
                            Import and assign to carrier
                        </v-card-subtitle>
                        <v-list v-if="pagination">
                            <div v-for="(carrier, i) in pagination.items" :key="carrier.id ?? i">
                                <v-list-item @click="() => createShipment({ carrier })" color="primary" class="mx-0"
                                    :elevation="0" :disabled="isImportingShipping || !orderIds.length" variant="flat"
                                    :loading="isImportingShipping && carrier.id == choosenCarrier?.id">
                                    <template v-slot:prepend>
                                        <v-avatar v-if="carrier.logoImage">
                                            <v-img :src="carrier.logoImage.url" />
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

                </v-card>
            </v-menu>

        </v-row>
    </div>
    <v-btn v-else @click="() => createShipment()" :loading="isImportingShipping" color="primary" :elevation="0"
        :disabled="!orderIds.length" variant="flat" v-bind="attrs">
        {{ importLabel ?? 'Import Shipment' }}
        <v-icon>mdi-import</v-icon>
    </v-btn>
</template>

<script lang="ts" setup>
import { getPaginatedCarriers } from "@/admin/repository/carrier/carrier_repository";
import { getOrder, bulkImportShipment } from "@/admin/repository/order/order_repository";
import Carrier from "@/model/carrier/carrier";
import Channel from "@/model/channel/channel";
import Shipment from "@/model/shipment/shipment";
import ShipmentFulfilmentType from "@/model/shipment/shipment_fulfilment_type";
import useSWRV from "swrv";
import { ref, useAttrs } from "vue";
import { useNotifier } from "vuetify-notifier";

const props = defineProps<{
    channel: Channel,
    orderIds: string[],
    // id: number | string,
    // height?: number | string,
    fulfilmentType?: ShipmentFulfilmentType;
    // 
    assignLabel?: string;
    importLabel?: string;
}>();

const emit = defineEmits<{
    // close: () => void,
    (e: 'imported', shipments?: Shipment[]): void,
}>();


const notifier = useNotifier();
const attrs = useAttrs();


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
const notifyCarrier = ref(true);
const createShipment = async ({ carrier }: { carrier?: Carrier } = {}) => {
    try {
        choosenCarrier.value = carrier;
        isImportingShipping.value = true;
        await bulkImportShipment(props.orderIds, {
            channel: props.channel,
            carrier,
            fulfilmentType: props.fulfilmentType ?? ShipmentFulfilmentType.PICKUP_AND_DELIVERY,
            notify: notifyCarrier.value,
        });
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