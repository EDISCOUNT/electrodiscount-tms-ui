<template>
    <v-card flat>
        <template v-slot:title>
            <slot name="title">

            </slot>
        </template>
        <template v-slot:subtitle>
            <slot name="subtitle">

            </slot>
        </template>

        <v-card-text>
            <ShipmentTable :filter="filter" :height="height" />
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import ShipmentTable from '@/admin/views/shipment/shipment/partials/ShipmentTable.vue';
import Carrier from '@/model/carrier/carrier';
import { comparison, eq } from 'rsql-builder';
import { computed } from 'vue';
import { useNotifier } from 'vuetify-notifier';
import { useDisplay } from 'vuetify';

const props = defineProps<{
    carrier: Carrier,
    height?: number | string;
}>();


const filter = computed(() => ({
    // filter: comparison('carrier.id', eq(props.carrier.id)).toString(),
    carrier: [props.carrier.id]
}));

const notifier = useNotifier();
const { xs, smAndDown, smAndUp, mdAndUp, sm, lg } = useDisplay();

const height = computed(() => {

    if (props.height) {
        return props.height;
    }

    if (xs.value) {
        return 'calc(100vh - 210px)';
    }
    return 'calc(100vh - 315px)'
})

</script>