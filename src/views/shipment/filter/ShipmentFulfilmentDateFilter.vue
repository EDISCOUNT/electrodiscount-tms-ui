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


                <template v-slot:append-inner>
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props">mdi-chevron-down</v-icon>
                        </template>
                        <v-card flat>
                            <!-- <v-list>

                            </v-list> -->
                            <v-card-text>
                                <v-switch v-for="(field, i) in ['latestDeliveryDate', 'exactDeliveryDate', 'expiryDate']"
                                    v-model="_fields" @click.stop="() => undefined" key="field" :value="field"
                                    :label="field" class="ma-0 pa-0 shrink" color="primary" inset multiple />
                            </v-card-text>
                        </v-card>
                    </v-menu>
                </template>
            </v-combobox>
        </template>
        <v-card flat>
            <!-- <v-card-title>
                {{ { dates } }}
            </v-card-title> -->
            <v-card-text r-class="pa-0">
                <v-row>
                    <v-col>
                        <v-date-picker v-model="values" show-adjacent-months multiple />
                    </v-col>
                    <v-col>
                        <v-card class="fill-height" color="secondary-bg" width="100%" flat/>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-menu>
</template>
<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import { formatDate } from '@/utils/format';
import { formatDateNamed } from '@/utils/format/date';
import { sameday } from '@/utils/rsql';
import { Comparison, comparison, or } from 'rsql-builder';
import { computed, ref, useAttrs, watch } from 'vue';
import DateFnsAdapter from '@date-io/date-fns'

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
}>();

const emit = defineEmits<{
    (e: 'update:model-value', dates?: (string | Date)[]): void;
    (e: 'update:rsql', rsql?: string): void;
}>();


const attrs = useAttrs();


const values = ref<(string | Date)[]>();
const dates = computed(
    () => values.value?.map(e => toLocalDate(e))
);

const _fields = ref<('latestDeliveryDate' | 'exactDeliveryDate' | 'expiryDate')[]>(['exactDeliveryDate']);


const fields = computed(() => {
    return props.fields ?? _fields.value;
});
const itemsFields = computed(() => {
    return props.itemsFields ?? _fields.value;
});


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