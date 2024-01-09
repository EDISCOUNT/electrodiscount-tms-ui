<template>
    <div>
        <v-menu v-model="isOpen" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
                <slot name="activator" v-bind:props="props" v-bind:start="null">
                    <v-text-field v-bind="{ ...props, ...attrs }" :model-value="label" @click:clear="() => clear()"
                        :clearable="!!range" readonly>
                        <template v-slot:append-inner>
                            <slot name="append-inner">
                            </slot>
                        </template>

                        <template v-slot:append>
                            <slot name="append">
                                <!-- <v-icon>mdi-calendar</v-icon> -->
                            </slot>
                        </template>
                    </v-text-field>
                </slot>
            </template>
            <v-card flat>
                <v-card-text>
                    <DateRangeSelector v-model="range" />
                </v-card-text>
            </v-card>
        </v-menu>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, useAttrs, watch } from 'vue';
import DateRangeSelector from './DateRangeSelector.vue';
import { DateRangeInput } from './types';
import { buildDateLabel } from './utils';

const props = defineProps<{
    modelValue?: DateRangeInput;
}>();


const emit = defineEmits<{
    (e: 'update:modelValue', value?: DateRangeInput): void;
}>();


const attrs = useAttrs();


const isOpen = ref(false);
const range = ref<DateRangeInput>();

const isUpdatingInput = ref(false);
watch(
    () => props.modelValue,
    (value) => {
        isUpdatingInput.value
        range.value = value;
        setTimeout(() => {
            isUpdatingInput.value = false;
        }, 100);
    },
);

watch(
    () => range.value,
    (value) => {
        if (isUpdatingInput.value) {
            return;
        }
        emit('update:modelValue', value);
    },
    { deep: true },
);


const label = computed(() => {
    // if(!range.value){
    //     return '-'.repeat(10);
    // }
    return `${buildDateLabel(range.value?.start)} --- ${buildDateLabel(range.value?.end)}`;
});


function clear() {
    // console.log("CLEAR");
    range.value = undefined;
}



</script>