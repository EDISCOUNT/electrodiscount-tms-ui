<template>
    <v-autocomplete v-model="selected" v-model:search="search" :items="pagination?.items" item-title="name" item-value="id"
        v-bind="attrs">
        <template v-if="loading" v-slot:append-inner>
            <v-progress-circular indeterminate size="24" />
        </template>

        <template v-slot:selection="{ item, index, }">
            <template v-if="index == 0">
                {{ item?.raw?.name }}
            </template>
            <template v-else-if="Array.isArray(selected) && index == ((selected?.length ?? 0) - 1)">
                <v-chip size="small">
                    +{{ (selected?.length ?? 0) - 1 }} more
                </v-chip>
            </template>
        </template>


        <!-- <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props"  :title="item?.raw?.name"
                :subtitle="item?.raw?.code"></v-list-item>
        </template> -->

    </v-autocomplete>
</template>

<script lang="ts" setup>
import { getPaginatedCategories } from '@/admin/repository/catalog/category_repository';
import useSWRV from 'swrv';
import { ref, watch, useAttrs } from 'vue';
import { useNotifier } from 'vuetify-notifier';


const attrs = useAttrs();

const props = defineProps<{
    modelValue?: ID | ID[],
}>();

const emit = defineEmits<{
    (e: 'update:model-value', selected?: ID | ID[]): void;
}>();

const notifier = useNotifier();



const selected = ref<ID[] | ID | undefined>(props.modelValue );
const search = ref<string>();

const { data: pagination, isValidating: loading, error } = useSWRV(
    () => `/api/admin/catalog/categories?search=${search.value}&limit=${100}`,
    () => getPaginatedCategories({ search: search.value, limit: 100 }),
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



watch(() => props.modelValue, (value) => {
    selected.value = value;
});

watch(() => selected.value, (value) => {
    emit('update:model-value', value);
});

</script>