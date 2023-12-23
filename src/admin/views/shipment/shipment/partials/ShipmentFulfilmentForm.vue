<template>
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-text-field v-model="data.exactDeliveryDate" v-bind="props" label="Expected Delivery Date"
                :placeholder="new Date().toLocaleDateString()" variant="outlined" density="compact" readonly />
        </template>
        <v-date-picker v-model="data.exactDeliveryDate" label="Expected Delivery Date" variant="outlined"
            density="compact"></v-date-picker>
    </v-menu>

    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-text-field v-model="data.latestDeliveryDate" v-bind="props" label="Latest Delivery Date"
                :placeholder="new Date().toLocaleDateString()" variant="outlined" density="compact" readonly />
        </template>
        <v-date-picker v-model="data.latestDeliveryDate" label="Latest Delivery Date" variant="outlined"
            density="compact"></v-date-picker>
    </v-menu>
</template>
<script lang="ts" setup>
import { ShipmentFulfilmentFormData } from '@/model/shipment/shipment_fulfilment';
import { reactive, watch } from 'vue';



const props = defineProps<{
    modelValue?: ShipmentFulfilmentFormData;
}>();

const emit = defineEmits<{
    (e: 'update:model-value', value?: ShipmentFulfilmentFormData): void;
}>();


const data = reactive<ShipmentFulfilmentFormData>({
    ...(props.modelValue ?? {})
});



watch(data, (data) => emit('update:model-value', { ...data }));
watch(
    () => props.modelValue, (input) => {
        if (input) {
            for (const key in input) {
                const value = (input as any)[key];
                (data as any)[key] = value;
            }
        } else {
            for (const key in data) {
                (data as any)[key] = undefined;
            }
        }
    }
);


</script>