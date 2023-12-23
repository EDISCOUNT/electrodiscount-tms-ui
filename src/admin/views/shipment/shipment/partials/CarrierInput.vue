<template>
    <v-autocomplete v-model="selected" v-model:search="search" :items="pagination?.items" item-title="name" item-value="id"
        v-bind="attrs">
        <template v-if="loading" v-slot:append-inner>
        <v-progress-circular  indeterminate size="24"/>
    </template>
    </v-autocomplete>
</template>

<script lang="ts" setup>
import { getPaginatedCarriers } from '@/admin/repository/carrier/carrier_repository';
import useSWRV from 'swrv';
import { ref, watch, useAttrs } from 'vue';
import { useNotifier } from 'vuetify-notifier';


const attrs = useAttrs();

const props = defineProps<{
    modelValue?: string,
}>();

const emit = defineEmits<{
    (e: 'update:model-value', selected?: string): void;
}>();

const notifier = useNotifier();



const selected = ref<string>();
const search = ref<string>();

const { data: pagination, isValidating: loading, error } = useSWRV(
    () => `/api/admin/catalog/carriers?search=${search.value}`,
    () => getPaginatedCarriers({ search: search.value }),
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



// watch(() => props.modelValue, (value) => {
//     selected.value = value;
// });

// watch(() => selected.value, (value) => {
//     emit('update:model-value', value);
// });

</script>