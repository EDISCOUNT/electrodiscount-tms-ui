<template>
    <!-- <v-col :cols="12" :sm="3" r-:md="4" r-:lg="3">
        <ShipmentFulfilmentDateFilter v-model="filter.fulfilmentDateRange" v-model:rsql="filter.fulfilmentDatesRsql"
            label="Expected Delivery Dates" placeholder="Select fulfilment dates" variant="outlined" density="compact"
            :fields="['fulfilment.exactDeliveryDate']" :possible-fields="[
                { label: 'Exact Delivery Date', value: 'fulfilment.latestDeliveryDate' },
                { label: 'Latest Delivery Date', value: 'fulfilment.exactDeliveryDate', },
                { label: 'Expiry Date', value: 'fulfilment.expiryDate' }
            ]" filter-main filter-items allow-select-fields multiple clearable />
    </v-col>
    <v-col :cols="12" :sm="3" r-:md="4" r-:lg="3">
        <ShipmentFulfilmentDateFilter v-model="filter.deliveryDateRange" v-model:rsql="filter.deliveryDateRsql"
            label="Delivery Dates" placeholder="Select fulfilment dates" variant="outlined"
            r-:possible-fields="[{ label: 'Delivery Date', value: 'deliveryDate' }]" :fields="['deliveredAt']" filter-main
            density="compact" multiple clearable />
    </v-col> -->
    <!-- {{ {dateType} }} -->
    <v-row justify="space-around">
        <v-chip-group v-model="dateType" variant="text">
            <v-chip>
                Today
            </v-chip>

            <v-chip>
                This Week
            </v-chip>

            <v-chip>
                This Month
            </v-chip>

            <v-chip>
                This Year
            </v-chip>

            <v-chip>
                Ever
            </v-chip>

            <template v-if="false">
                <!-- @update:rsql="dateType = ShipmentFilterDateType.DATE_SELECT" -->
                <ShipmentFulfilmentDateFilter v-model:rsql="rsql" :possible-fields="possibleFields" :fields="fields"
                    filter-main :filter-items="filterItems">
                    <template v-slot:activator="{ props, possibleFields, fields, updateFields }">
                        <v-chip v-bind="props">
                            Select Dates
                            <!-- <v-menu v-if="possibleFields.length">
                            <template v-slot:activator="{ props: optionsProps }">
                                <v-icon v-bind="optionsProps">mdi-chevron-down</v-icon>
                                <v-card flat>
                                    <v-card-text>
                                        <v-switch v-for="(field, i) in possibleFields" :model-value="fields"
                                            @update:model-value="(fields) => updateFields(fields ?? [])"
                                            @click.stop="() => undefined" key="field" :value="field.value"
                                            :label="field.label" class="ma-0 pa-0 shrink" color="primary" inset multiple />
                                    </v-card-text>
                                </v-card>
                            </template>
                        </v-menu> -->
                        </v-chip>
                    </template>
                </ShipmentFulfilmentDateFilter>

                <!-- @update:rsql="dateType = ShipmentFilterDateType.DATE_RANGE_SELECT" -->
                <ShipmentFulfilmentDateRangeFilter v-model:rsql="rsql" :possible-fields="possibleFields" :fields="fields"
                    filter-main :filter-items="filterItems">
                    <template v-slot:activator="{ props, possibleFields, fields, updateFields }">
                        <v-chip v-bind="props">
                            Select Date Range
                            <!-- <v-menu v-if="possibleFields.length">
                            <template v-slot:activator="{ props: optionsProps }">
                                <v-icon v-bind="optionsProps">mdi-chevron-down</v-icon>
                                <v-card flat>
                                    <v-card-text>
                                        <v-switch v-for="(field, i) in possibleFields" :model-value="fields"
                                            @update:model-value="(fields) => updateFields(fields ?? [])"
                                            @click.stop="() => undefined" key="field" :value="field.value"
                                            :label="field.label" class="ma-0 pa-0 shrink" color="primary" inset multiple />
                                    </v-card-text>
                                </v-card>
                            </template>
                        </v-menu> -->
                        </v-chip>
                    </template>

                </ShipmentFulfilmentDateRangeFilter>
            </template>

        </v-chip-group>
    </v-row>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { ShipmentFilterDateType } from '../types';
import { Comparison, comparison, or } from 'rsql-builder';
import { sameday, samemonth, sameweek, sameyear } from '@/utils/rsql';
import ShipmentFulfilmentDateFilter from '@/views/shipment/filter/ShipmentFulfilmentDateFilter.vue';
import ShipmentFulfilmentDateRangeFilter from '@/views/shipment/filter/ShipmentFulfilmentDateRangeFilter.vue';
import { endOfDay, endOfMonth, endOfWeek, endOfYear, startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import { DateRangeInput } from '@/views/shipment/filter/DateRange';


type DateInput = DateRangeInput | Date[];

const now = new Date();

const props = defineProps<{
    modelValue?: any;
    fields?: string[];
    possibleFields?: { label: string; value: string }[];
    filterItems?: boolean;
    deliveredDate?: boolean;
    expectedDate?: boolean;
    applyToItems?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:rsql', value?: string): void;
    (e: 'update:dates', value?: DateInput): void;
}>();



const dateType = ref<ShipmentFilterDateType>(ShipmentFilterDateType.THIS_YEAR);
const rsql = ref<string>();

watch(
    () => ({ rsql: rsql.value, dateType: dateType.value, }),
    ({ rsql, dateType }) => {
        setTimeout(() => updateRsql());
        setTimeout(() => updateDates());
    }
);

onMounted(() => setTimeout(() => {
    updateRsql();
    updateDates();
}, 5));
const fields = computed(() => props.fields ?? props.possibleFields?.map(e => e.value) ?? []);



function updateRsql() {
    const rsql = buildRsql(fields.value);
    emit('update:rsql', rsql);
    // console.log("RSQL: ", { rsql });
}


function updateDates() {
    const dates = buildRange(dateType.value);
    emit('update:dates', dates);
}



function buildRsql(_fields: string[]) {
    // console.log("RSQL: ",{rsql, dateType: dateType.value});
    console.log("BUILDING FIELDS: ", { _fields });
    switch (dateType.value) {
        case ShipmentFilterDateType.DATE_SELECT:
        case ShipmentFilterDateType.DATE_RANGE_SELECT:
            return rsql.value;

        default:
            const predicates = fields.value.map(field => buildFieldRsql(field))//: Comparison[] = [];
            if (props.filterItems) {
                const itemPredicates = fields.value.map(field => buildFieldRsql(`items.${field}`))//: Comparison[] = [];
                predicates.push(...itemPredicates);
            }
            return or(...predicates,);
    }
}
function buildFieldRsql(field: string) {
    // console.log("BUILDING FIELDS: ",{field});
    switch (dateType.value) {
        case ShipmentFilterDateType.TODAY:
            return comparison(field, sameday(now));
        case ShipmentFilterDateType.THIS_WEEK:
            return comparison(field, sameweek(now));
        case ShipmentFilterDateType.THIS_MONTH:
            return comparison(field, samemonth(now));
        case ShipmentFilterDateType.THIS_YEAR:
            return comparison(field, sameyear(now));

        default:
            return '' as string;
    }
}


function buildRange(type: ShipmentFilterDateType) {
    // console.log("BUILDING FIELDS: ",{field});
    switch (type) {
        case ShipmentFilterDateType.TODAY:
            return { start: startOfDay(now), end: endOfDay(now) };
        case ShipmentFilterDateType.THIS_WEEK:
            return { start: startOfWeek(now), end: endOfWeek(now) };
        case ShipmentFilterDateType.THIS_MONTH:
            return { start: startOfMonth(now), end: endOfMonth(now) };
        case ShipmentFilterDateType.THIS_YEAR:
            return { start: startOfYear(now), end: endOfYear(now) };

        default:
            return undefined;
            // return { start: undefined, end: undefined };
    }
}

</script>