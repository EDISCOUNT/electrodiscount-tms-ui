<template>
    <StorageInput v-model="selected" :disabled="isFetchingStorage" />
</template>

<script lang="ts" setup>
import { getPaginatedStorages, getStorage } from '@/admin/repository/inventory/storage_repository';
import Storage from '@/model/inventory/storage';
import { debounce } from 'lodash';
import useSWRV from 'swrv';
import { ref, watch, useAttrs } from 'vue';
import { useNotifier } from 'vuetify-notifier';
import StorageInput from './StorageInput.vue';

const attrs = useAttrs();

const props = defineProps<{
    modelValue?: Storage,
}>();

const emit = defineEmits<{
    (e: 'update:model-value', selected?: Storage): void;
}>();

const notifier = useNotifier();



const selected = ref(props.modelValue?.id);
const storage = ref<Storage>();
const search = ref<string>();


// watch(error, (value) => {
//     if (error) {
//         const message = (error.value as any) ?? 'Error';
//         notifier.toastError(message);
//     }
// });



watch(() => props.modelValue, (value) => {
    selected.value = value?.id;
});

watch(() => storage.value, (value) => {
    emit('update:model-value', value);
});


watch(selected, async (value) => {
    try {
        if (value) {
            storage.value = await fetchStorage(value);
        }
        else {
            storage.value = undefined;
        }
    } catch (err) {
        console.log(err);
    }
});



const isFetchingStorage = ref(false);
async function doFetchStorage(id: string) {
    try {
        isFetchingStorage.value = true;
        const storage = await getStorage(id);
        return storage;
    }
    catch (err) {
        const message = (err as any) ?? 'Error';
        notifier.toastError(message);
        throw err;
    }
    finally {
        isFetchingStorage.value = false;
    }

}

const fetchStorage = debounce(doFetchStorage, 500, { leading: true, trailing: true });

</script>