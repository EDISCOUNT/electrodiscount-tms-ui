<template>
    <v-autocomplete v-model="selected" v-model:search="search" :items="pagination?.items" item-title="name" item-value="id"
        v-bind="attrs">
        <template v-if="loading" v-slot:append-inner>
        <v-progress-circular  indeterminate size="24"/>
    </template>
    </v-autocomplete>
</template>

<script lang="ts" setup>
import { getPaginatedProducts } from '@/admin/repository/catalog/product_repository';
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



const selected = ref(props.modelValue);
const search = ref<string>();

const { data: pagination, isValidating: loading, error } = useSWRV(
    () => `/api/admin/catalog/products?search=${search.value}`,
    () => getPaginatedProducts({ search: search.value, limit: 100 }),
    {
        refreshInterval: 0,
        revalidateOnFocus: false,
        // revalidateOnReconnect: false,
    }
);

watch(error, (value) => {
    if (error) {
        const message = (error.value as any) ?? 'Error';
        notifier.toastError(message);
    }
});



watch(() => props.modelValue, (value) => {
    selected.value = value;
});

watch(() => selected.value, (value) => {
    emit('update:model-value', value);
});

</script>