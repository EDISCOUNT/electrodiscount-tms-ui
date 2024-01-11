<template>
    <v-text-field v-model="date" type="datetime-local" />
</template>

<script lang="ts" setup>
import { is } from '@babel/types';
import { format } from 'path';
import { slice } from 'lodash';
import { ref, watch } from 'vue';
import { formatDateString } from '@/utils/format/date';


const props = defineProps<{
    modelValue?: string | Date;
}>();

const emit = defineEmits<{
    (e: 'update:model-value', value?: string): void;
}>();



const date = ref<string>();

const isUpdating = ref(false);
watch(
    () => props.modelValue,
    (value) => {
        isUpdating.value = true;
        if (value) {
            if(value instanceof Date){
                // value = value.toUTCString().slice(0, 23);
                // value =  format(value, 'yyyy-MM-ddThh:mm:ss.SSS');
                value = formatDateString(value).slice(0, 23);
                console.log("TIME FORMATED: ", {value});
            }
            date.value = value;
        } else {
            date.value = undefined;
        }
        setTimeout(() => isUpdating.value = false, 10);
    }
);

watch(date,
    (value) => {
        if (!isUpdating.value) {
            if (value) {
                value = new Date(value);
            }
            emit('update:model-value', value);
        }
    }
);
// yyyy-MM-ddThh:mm
</script>