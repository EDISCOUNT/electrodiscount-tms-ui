<template>
    <v-card flat>
        <v-card-text>
            <v-row justify>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>
import ShipmentDimension from '@/model/shipment/shipment_dimension';

const props = defineProps<{
    dimension: ShipmentDimension
}>();
</script>