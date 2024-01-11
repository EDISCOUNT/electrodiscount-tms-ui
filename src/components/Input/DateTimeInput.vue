<template>
    <v-text-field v-model="date" type="datetime-local" />
</template>

<script lang="ts" setup>
import { is } from '@babel/types';
import { ref, watch } from 'vue';


const props = defineProps<{
    modelValue?: string | Date;
}>();

const emit = defineEmits<{
    (e: 'update:model-value', value?: string): void;
}>();



const date = ref<Date>();

const isUpdating = ref(false);
watch(
    () => props.modelValue,
    (value) => {
        isUpdating.value = true;
        if (value) {
            date.value = new Date(value);
        } else {
            date.value = undefined;
        }
        setTimeout(() => isUpdating.value = false, 10);
    }
);

watch(date,
    (value) => {
        if (!isUpdating.value) {
            emit('update:model-value', value?.toISOString());
        }
    }
);
</script>