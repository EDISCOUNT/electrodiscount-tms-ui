<template>
    <DateRangeField v-model="range">
        <template v-slot:activator="{ props }">
            <slot name="activator" v-bind:props="props" v-bind:possibleFields="possibleFields" v-bind:fields="_fields" v-bind:range="range" v-bind:updateFields="updateFields"></slot>
        </template>
        <template v-slot:append-inner>
            <slot name="append-inner" v-bind:possibleFields="possibleFields" v-bind:fields="_fields"  v-bind:range="range" v-bind:updateFields="updateFields">
                <v-menu v-if="possibleFields.length">
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props">mdi-chevron-down</v-icon>
                    </template>
                    <v-card flat>
                        <v-card-text>
                            <v-switch v-for="(field, i) in possibleFields" v-model="_fields" @click.stop="() => undefined"
                                key="field" :value="field.value" :label="field.label" class="ma-0 pa-0 shrink"
                                color="primary" inset multiple />
                        </v-card-text>
                    </v-card>
                </v-menu>
            </slot>
        </template>
    </DateRangeField>
</template>
<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import { formatDate } from '@/utils/format';
import { formatDateNamed } from '@/utils/format/date';
import { sameday, toDateString } from '@/utils/rsql';
import { Comparison, and, comparison, ge, le, or } from 'rsql-builder';
import { computed, onMounted, ref, useAttrs, watch } from 'vue';
import DateFnsAdapter from '@date-io/date-fns'
// import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { DateRangeField, DateRangeInput } from './DateRange';


const props = defineProps<{
    shipments?: Shipment[];
    modelValue?: DateRangeInput;
    fields?: string[];
    itemsFields?: string[];
    possibleFields?: { value: string, label: string }[];
    // allowSelectFields?: boolean;
    filterItems?: boolean;
    filterMain?: boolean | true;
}>();

const emit = defineEmits<{
    (e: 'update:model-value', range?: DateRangeInput): void;
    (e: 'update:rsql', rsql?: string): void;
}>();


const range = ref<DateRangeInput>();
// const dates = computed(
//     () => range.value?.map(e => toLocalDate(e))
// );

const _fields = ref<string[]>();

const possibleFields = computed(() => {
    // if(props.possibleFields)
    return props.possibleFields ?? [];
})

const fields = computed(() => {
    return props.fields ?? _fields.value;
});
const itemsFields = computed(() => {
    return props.itemsFields ?? fields.value ?? _fields.value;
});

function updateFields(fields: string[]) {
    console.log("UPDATE FIELDS: ", fields);
    _fields.value = fields;
}

onMounted(() => _fields.value = props.fields ?? possibleFields.value.map(e => e.value));


watch(_fields, (fields) => emitValues(range.value));
watch(range, (range) => {
    // const out = values?.map(e => new Date(e));
    emitValues(range);

}, { deep: true });
watch(
    () => props.modelValue,
    (dates) => range.value = dates
);


function emitValues(range?: DateRangeInput) {
    emit('update:model-value', range);
    emit('update:rsql', buildRsql(range));
}

const isOpen = ref(false);




function buildRsql(range?: DateRangeInput) {
    let rsql = '';

    if (!range) {
        return undefined;
    }

    const allPredicates: (Comparison | string)[][] = [];
    // let innerRsql: Comparison | string = '';

    console.log("PROPS: ", { ...props });

    if (props.filterMain !== false) {
        if (fields.value?.length) {
            // innerRsql = '';
            for (const field of fields.value) {
                const predicates: (Comparison | string)[] = [];
                // for (const date of dates) {
                //     const predicate = comparison(`fulfilment.${field}`, sameday(date));
                //     predicates.push(predicate);
                // }
                if (range.start) {
                    const predicate = comparison(`${field}`, ge(toDateString(range.start)));
                    predicates.push(predicate);
                }
                if (range.end) {
                    const predicate = comparison(`${field}`, le(toDateString(range.end)));
                    predicates.push(predicate);
                }
                if (predicates.length > 0) {
                    allPredicates.push(predicates);
                }
            }
        }
    }

    if (props.filterItems === true) {
        console.log("FILTERING ITEMS: ", '.'.repeat(12))
        if (itemsFields.value?.length) {
            // innerRsql = '';
            for (const field of itemsFields.value) {
                const predicates: (Comparison | string)[] = [];
                if (range.start) {
                    const predicate = comparison(`items.${field}`, ge(toDateString(range.start)));
                    predicates.push(predicate);
                }
                if (range.end) {
                    const predicate = comparison(`items.${field}`, le(toDateString(range.end)));
                    predicates.push(predicate);
                }
                if (predicates.length > 0) {
                    allPredicates.push(predicates);
                }
            }
        }
    }

    rsql = or(...allPredicates.map(predicates => and(...predicates)));
    // console.log("DATE RSQL: ", { rsql, allPredicates })
    return rsql;
}

</script>