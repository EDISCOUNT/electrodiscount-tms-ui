<template>
    <v-menu v-model="isOpen" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <slot name="activator" v-bind:props="props" v-bind:possibleFields="possibleFields" v-bind:fields="_fields"
                v-bind:dates="dates" v-bind:updateFields="updateFields">

                <v-combobox v-model="values" variant="outlined" v-bind="{ ...props, ...attrs }" readonly multiple>
                    <template v-slot:chip="{ item: { raw: date }, index }">
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


                    <template v-slot:append-inner>
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props">mdi-chevron-down</v-icon>
                            </template>
                            <v-card flat>
                                <v-card-text>
                                    <v-switch v-for="(field, i) in possibleFields" v-model="_fields"
                                        @click.stop="() => undefined" key="field" :value="field.value" :label="field.label"
                                        class="ma-0 pa-0 shrink" color="primary" inset multiple />
                                </v-card-text>
                            </v-card>
                        </v-menu>
                    </template>
                </v-combobox>
            </slot>
        </template>
        <v-card flat>
            <v-card-text r-class="pa-0">
                <v-row>
                    <v-col>
                        <v-date-picker v-model="values" show-adjacent-months multiple range />
                    </v-col>
                    <v-col>
                        <v-card class="fill-height" color="secondary-bg" width="100%" flat />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-menu>
    <!-- <div class="" style="z-index: 70">
        <VueDatePicker v-model="date" style="z-index: 2;" range></VueDatePicker>
    </div>
     <DateRangeField/> -->
</template>
<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import { formatDate } from '@/utils/format';
import { formatDateNamed } from '@/utils/format/date';
import { sameday } from '@/utils/rsql';
import { Comparison, comparison, or } from 'rsql-builder';
import { computed, onMounted, ref, useAttrs, watch } from 'vue';
import DateFnsAdapter from '@date-io/date-fns'
// import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import DateRangeField from './DateRange/DateRangeField.vue';

const adapter = new DateFnsAdapter();
function toLocalDate(date: string | Date) {
    const lDate = new Date(date).toLocaleString();
    const nDate = new Date(lDate);
    return nDate;
}



const props = defineProps<{
    shipments?: Shipment[];
    modelValue?: (string | Date)[];
    fields?: string[];
    itemsFields?: string[];
    possibleFields?: { value: string, label: string }[];
    // allowSelectFields?: boolean;
    filterItems?: boolean;
    filterMain?: boolean | true;
}>();

const emit = defineEmits<{
    (e: 'update:model-value', dates?: (string | Date)[]): void;
    (e: 'update:rsql', rsql?: string): void;
}>();


const attrs = useAttrs();
const date = ref<any>();


const values = ref<(string | Date)[]>();
const dates = computed(
    () => values.value?.map(e => toLocalDate(e))
);

const _fields = ref<string[]>();

const possibleFields = computed(() => {
    // if(props.possibleFields)
    return props.possibleFields ?? [];
});

onMounted(() => _fields.value = props.fields ?? possibleFields.value.map(e => e.value));

const fields = computed(() => {
    return props.itemsFields ?? props.fields ?? _fields.value;
});
const itemsFields = computed(() => {
    return props.itemsFields ?? _fields.value;
});

function updateFields(fields: string[]) {
    _fields.value = fields;
}


watch(_fields, (fields) => emitValues(dates.value ?? []));
watch(dates, (values) => {
    // const out = values?.map(e => new Date(e));
    emitValues(values ?? []);

}, { deep: true });
watch(
    () => props.modelValue,
    (dates) => values.value = dates
);


function emitValues(values: (Date)[]) {
    emit('update:model-value', values);
    emit('update:rsql', buildRsql(values));
}

const isOpen = ref(false);




function buildRsql(dates?: (string | Date)[]) {
    let rsql = '';

    if (!dates) {
        return undefined;
    }

    const allPredicates: (Comparison | string)[][] = [];
    // let innerRsql: Comparison | string = '';

    if (props.filterMain !== false) {
        if (fields.value?.length) {
            // innerRsql = '';
            for (const field of fields.value) {
                const predicates: (Comparison | string)[] = [];
                for (const date of dates) {
                    const predicate = comparison(`${field}`, sameday(date));
                    predicates.push(predicate);
                }
                if (predicates.length > 0) {
                    allPredicates.push(predicates);
                }
            }
        }
    }

    if (props.filterItems === true) {
        if (itemsFields.value?.length) {
            // innerRsql = '';
            for (const field of itemsFields.value) {
                const predicates: (Comparison | string)[] = [];
                for (const date of dates) {
                    const predicate = comparison(`items.${field}`, sameday(date));
                    predicates.push(predicate);
                }
                if (predicates.length > 0) {
                    allPredicates.push(predicates);
                }
            }
        }
    }

    rsql = or(...allPredicates.map(predicates => or(...predicates)));
    // console.log("DATE RSQL: ", { rsql, allPredicates })
    return rsql;
}

</script>