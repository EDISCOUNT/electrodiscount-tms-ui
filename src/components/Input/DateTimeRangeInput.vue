<template>
    <v-row>
        <v-col>
            <DateTimeInput v-model="data.startAt" />
        </v-col>
        <v-col>
            <DateTimeInput v-model="data.endAt" />
        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { is } from '@babel/types';
import { reactive } from 'vue';
import DateTimeInput from './DateTimeInput.vue';

interface DateTimeRangeInput {
    startAt?: Date;
    endAt?: Date;
}

const props = defineProps<{
    modelValue?: DateTimeRangeInput;
}>();

const data = reactive<DateTimeRangeInput>({});

const emit = defineEmits<{
    (e: 'update:model-value', value?: DateTimeRangeInput): void;
}>();

const isUpdating = ref(false);

watch(
    () => props.modelValue,
    (value) => {
        isUpdating.value = true;
        if (value) {
            data.startAt = value.startAt ? new Date(value.startAt) : undefined;
            data.endAt = value?.endAt ? new Date(value.endAt) : undefined;
        } else {
            data.startAt = undefined;
            data.endAt = undefined;
        }
        setTimeout(() => isUpdating.value = false, 10);
    }
);

watch(data,
    (value) => {
        if (!isUpdating.value) {
            emit('update:model-value', value);
        }
    }
);


</script>