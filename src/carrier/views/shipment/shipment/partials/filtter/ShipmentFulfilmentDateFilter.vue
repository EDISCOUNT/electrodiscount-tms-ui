<template>
    <v-menu v-model="isOpen" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-combobox v-model="values" variant="outlined" v-bind="{ ...props, ...attrs }" readonly multiple>
                <template v-slot:chip="{ item: { raw: date }, index }">
                    <!-- {{ {date} }} -->
                    <template v-if="index <= 1">
                        <v-chip size="small" @click:close="() => values?.splice(index, 1)" closable>
                            {{ formatDateNamed(date) }}
                        </v-chip>
                    </template>
                    <template v-if="index == 2">
                        <v-chip v-if="values?.length == 3" @click:close="() => values?.splice(index, 1)" closable
                            size="small">
                            {{ formatDateNamed(date) }}
                        </v-chip>
                        <v-chip v-else size="small">
                            +{{ (values?.length ?? 0) - 2 }} more
                        </v-chip>
                    </template>
                </template>
            </v-combobox>
        </template>
        <v-date-picker v-model="values" multiple />
    </v-menu>
</template>
<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import { formatDate } from '@/utils/format';
import { formatDateNamed } from '@/utils/format/date';
import { sameday } from '@/utils/rsql';
import { Comparison, comparison, or } from 'rsql-builder';
import { computed, ref, useAttrs, watch } from 'vue';


const props = defineProps<{
    shipments?: Shipment[];
    modelValue?: (string | Date)[];
    fields?: string[];
    itemsFields?: string[];
}>();

const emit = defineEmits<{
    (e: 'update:model-value', dates?: (string | Date)[]): void;
    (e: 'update:rsql', rsql?: string): void;
}>();


const attrs = useAttrs();


const values = ref<(string | Date)[]>();

watch(values, (values) => {
    emit('update:model-value', values);
    emit('update:rsql', buildRsql(values));
},{deep: true});
watch(
    () => props.modelValue,
    (dates) => values.value = dates
);


const isOpen = ref(false);



const fields = computed(() => {
    return props.fields ?? ['latestDeliveryDate', 'exactDeliveryDate', 'expiryDate']
});
const itemsFields = computed(() => {
    return props.itemsFields ?? ['latestDeliveryDate', 'exactDeliveryDate', 'expiryDate']
});


function buildRsql(dates?: (string | Date)[]) {
    let rsql = '';

    if (!dates) {
        return undefined;
    }

    const allPredicates: (Comparison | string)[][] = [];
    let innerRsql: Comparison | string = '';
    if (fields.value?.length) {
        innerRsql = '';
        for (const field of fields.value) {
            const predicates: (Comparison | string)[] = [];
            for (const date of dates) {
                const predicate = comparison(`fulfilment.${field}`, sameday(date));
                predicates.push(predicate);
            }
            if (predicates.length > 0) {
                allPredicates.push(predicates);
            }
        }
    }

    if (itemsFields.value?.length) {
        innerRsql = '';
        for (const field of itemsFields.value) {
            const predicates: (Comparison | string)[] = [];
            for (const date of dates) {
                const predicate = comparison(`items.fulfilment.${field}`, sameday(date));
                predicates.push(predicate);
            }
            if (predicates.length > 0) {
                allPredicates.push(predicates);
            }
        }
    }

    rsql = or(...allPredicates.map(predicates => or(...predicates)));
    console.log("DATE RSQL: ", { rsql, allPredicates })
    return rsql;
}

</script>