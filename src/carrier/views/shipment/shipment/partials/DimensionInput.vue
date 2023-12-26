<template>
    <v-row>
        <v-col cols="12" md="4">
            <v-text-field v-model="data.length" label="Length" variant="outlined" type="number" min="0" step="0.01"  density="compact" />
        </v-col>
        <v-col cols="12" md="4">
            <v-text-field v-model="data.width" label="Width" variant="outlined" type="number" min="0" step="0.01" density="compact" />
        </v-col>
        <v-col cols="12" md="4">
            <v-text-field v-model="data.height" label="Height" variant="outlined" type="number" min="0" step="0.01" density="compact" />
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { ShipmentDimensionFormData } from '@/model/shipment/shipment_dimension';
import { reactive, watch } from 'vue';


const props = defineProps<{
    modelValue?: ShipmentDimensionFormData;
}>();

const emit = defineEmits<{
    (e: 'update:model-value', value?: ShipmentDimensionFormData): void;
}>();


const data = reactive<ShipmentDimensionFormData>({
    ...(props.modelValue ?? { length: 0, width: 0, height: 0, })
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