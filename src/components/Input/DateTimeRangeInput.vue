<template>
    <!-- {{ { data } }} -->
    <v-row>
        <v-col>
            <DateTimeInput v-model="data.startAt" :rules="[
                (v: any) => !!v || 'Start date is required',
                (v: any) => !v || !data?.endAt || v < toLocalDate(data?.endAt) || 'Start date must be before end date'
            ]" :max="toLocalDate(data.endAt)" v-bind="attrs" />
        </v-col>
        <v-col>
            <DateTimeInput v-model="data.endAt" v-bind="attrs" :rules="[
                (v: any) => !!v || 'End date is required',
                (v: any) => !v || !data?.startAt || v > toLocalDate(data?.startAt) || 'End date must be after start date'
            ]" :min="toLocalDate(data.startAt)" />
        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
import { ref, watch, useAttrs } from 'vue';
import { is } from '@babel/types';
import { reactive } from 'vue';
import { formatDateString } from '@/utils/format/date';
import DateTimeInput from './DateTimeInput.vue';

interface DateTimeRangeInput {
    startAt?: Date;
    endAt?: Date;
}

const props = defineProps<{
    modelValue?: DateTimeRangeInput;
}>();

const attrs = useAttrs();

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


function toLocalDate(date?: Date) {
    // return date?.toUTCString().slice(0, 23);
    if (date) {
        return formatDateString(date).slice(0, 23);
    }
    return '';
}

</script>