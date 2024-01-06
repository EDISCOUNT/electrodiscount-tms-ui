<template>
    <div>
    <v-autocomplete r-v-model="selected" v-model:search="search" :items="pagination?.items" item-title="channelOrderId" item-value="id"
        v-bind="attrs" @update:model-value="(input) => onShipmentPreview(input)" placeholder="Search shipments with channel order id..." return-object auto-select-first clearable>
        <template v-if="loading" v-slot:append-inner>
            <v-progress-circular indeterminate size="24" />
        </template>

        <template v-slot:selection="{ item, index, }">
            <template v-if="index == 0">
                {{ item?.raw?.channelOrderId }}
            </template>
            <template v-else-if="index == ((selected?.length ?? 0) - 1)">
                <v-chip size="small">
                    +{{ (selected?.length ?? 0) - 1 }} more
                </v-chip>
            </template>
        </template>


        <!-- <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props"  :title="item?.raw?.name"
                :subtitle="item?.raw?.code"></v-list-item>
        </template> -->

        <template v-slot:item="{ item: { raw: { channelOrderId, code } }, props }">
            <v-list-item v-bind="props">
                <v-list-item-title>
                    {{ channelOrderId }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    {{ code }}
                </v-list-item-subtitle>
            </v-list-item>
        </template>

        <template v-slot:append>
            <slot name="append">
                <BarcodeScannerButton v-model:result="search"/>
            </slot>
        </template>
    </v-autocomplete>


    <v-dialog v-model="shipmentPreviewDialog" width="800px">
        <!-- <v-card flat> -->
            <!-- <template v-slot:append>
                <v-btn @click="shipmentPreviewDialog = false" icon>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template> -->
            <!-- <v-card-text v-if="shipmentForPreview"> -->
                <ShipmentPreview v-if="shipmentForPreview" :shipment="shipmentForPreview" @close="shipmentPreviewDialog = false"/>
            <!-- </v-card-text>
        </v-card> -->
    </v-dialog>

    </div>
</template>

<script lang="ts" setup>
import { getPaginatedShipments } from '@/admin/repository/shipment/shipment_repository';
import BarcodeScannerButton from '@/components/BarcodeScannerButton.vue';
import Shipment from '@/model/shipment/shipment';
import { like } from '@/utils/rsql';
import { Comparison, comparison, or } from 'rsql-builder';
import useSWRV from 'swrv';
import { ref, watch, useAttrs, computed } from 'vue';
import { useNotifier } from 'vuetify-notifier';
import ShipmentPreview from './ShipmentPreview.vue';


const attrs = useAttrs();

const props = defineProps<{
    modelValue?: string | string[],
    fields?: string[],
}>();

const emit = defineEmits<{
    (e: 'update:model-value', selected?: string | string[]): void;
}>();

const notifier = useNotifier();

const selected = ref<string[] | string>();
const search = ref<string>();

const fields = computed(() => props.fields ?? ['code', 'channelOrderId']);
const rsql = computed(() => {
    const predicates: Comparison[] = [];
    for (const field of fields.value) {
        predicates.push(comparison(field, like(search.value)));
    }
    return or(...predicates);
});

const { data: pagination, isValidating: loading, error } = useSWRV(
    () => search.value && `/api/admin/shipment/shipments?filter=${rsql.value}`,
    () => getPaginatedShipments({ criteria: { filter: rsql.value } }),
    {
        refreshInterval: 0,
        revalidateOnFocus: false,
        // revalidateOnReconnect: false,
    }
);

watch(error, (message) => {
    if (error) {
        // const message = (error.value as any) ?? 'Error';
        notifier.toastError(message);
    }
});



watch(() => props.modelValue, (value) => {
    selected.value = value;
});

watch(() => selected.value, (value) => {
    emit('update:model-value', value);
});



const shipmentPreviewDialog = ref(false);
const shipmentForPreview = ref<Shipment>();

function onShipmentPreview(shipment: Shipment | null) {
    console.log("INPUT: ",{shipment});
    shipmentForPreview.value = shipment?? undefined;
    shipmentPreviewDialog.value = true;
}

</script>