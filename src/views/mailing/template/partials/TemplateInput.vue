<template>
    <v-autocomplete v-model="selected" v-model:search="search" :items="pagination?.items" item-title="label" v-bind="attrs" return-object>
        <template v-if="loading" v-slot:append-inner>
            <v-progress-circular indeterminate size="24" />
        </template>
    </v-autocomplete>
</template>

<script lang="ts" setup>
import { getPaginatedEmailMessageTemplates } from '@/repository/mailing/template_repository';
import EmailMessageTemplate from '@/model/mailing/message_template';
import useSWRV from 'swrv';
import { ref, watch, useAttrs } from 'vue';
import { useNotifier } from 'vuetify-notifier';


const attrs = useAttrs();

const props = defineProps<{
    modelValue?: EmailMessageTemplate,
}>();

const emit = defineEmits<{
    (e: 'update:model-value', selected?: EmailMessageTemplate): void;
    (e: 'input', valu?: EmailMessageTemplate): void;
}>();

const notifier = useNotifier();



const selected = ref(props.modelValue);
const search = ref<string>();

const { data: pagination, isValidating: loading, error } = useSWRV(
    () => `/api/admin/mailing/mesage_templates?search=${search.value}`,
    () => getPaginatedEmailMessageTemplates({ search: search.value }),
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
    emit('input', value);
});

</script>