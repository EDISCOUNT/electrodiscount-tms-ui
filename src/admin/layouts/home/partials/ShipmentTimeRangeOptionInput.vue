<template>
    <v-card flat>
        <!-- <v-card-title class="py-5">
            <v-row>
                <span class="px-3">Date Option</span>
                <v-spacer />
                <v-chip-group v-model="type" r-variant="plain" class="mb-2" mandatory>
                    <v-chip :value="ShipmentFilterDateEndType.EXPECTED" label>
                        Expected
                    </v-chip>
                    <v-chip :value="ShipmentFilterDateEndType.DELIVERED" label>
                        Delivered
                    </v-chip>
                </v-chip-group>
            </v-row>
        </v-card-title> -->
        <v-card-text>
            <!-- {{ { dates, rsql } }} -->

            <!-- {{ { dType: typeof(dates)} }} -->
            <ShipmentTimeRangeInput v-model:dates="dates" :possible-fields="[]" :fields="[]" r-:possible-fields="[
                { label: 'Exact Delivery Date', value: 'fulfilment.latestDeliveryDate' },
                { label: 'Latest Delivery Date', value: 'fulfilment.exactDeliveryDate', },
                { label: 'Expiry Date', value: 'fulfilment.expiryDate' }
            ]" apply-to-items v-model:rsql="rsql" filter-items>
            </ShipmentTimeRangeInput>

            <!-- <ShipmentTimeRangeInput  v-if="type == ShipmentFilterDateEndType.DELIVERED" :possible-fields="[]" :fields="[]" v-model:dates="dates"
                r-:fields="['deliveredAt']" v-model:rsql="rsql" :filter-items="false">
            </ShipmentTimeRangeInput>

            <ShipmentTimeRangeInput v-model:dates="dates" :possible-fields="[]" :fields="[]" r-:possible-fields="[
                { label: 'Exact Delivery Date', value: 'fulfilment.latestDeliveryDate' },
                { label: 'Latest Delivery Date', value: 'fulfilment.exactDeliveryDate', },
                { label: 'Expiry Date', value: 'fulfilment.expiryDate' }
            ]" v-else-if="type == ShipmentFilterDateEndType.EXPECTED" apply-to-items v-model:rsql="rsql" filter-items>
            </ShipmentTimeRangeInput> -->

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { ShipmentFilterDateEndType } from '../types';
import ShipmentTimeRangeInput from './ShipmentTimeRangeInput.vue';
import { DateRangeInput } from '@/views/shipment/filter/DateRange/types';

type Scalar = string | number | boolean;
type DateInput = DateRangeInput | Date[];
type Criteria = { [i: string]: Scalar | Scalar[] | undefined };

const props = defineProps<{
    possibleFields?: { label: string; value: string }[];
}>();

const emit = defineEmits<{
    (e: 'update:rsql', value?: string): void;
    (e: 'update:criteria', value?: DateInput): void;
}>();

const dates = ref<DateInput>();
const rsql = ref<string>();
const type = ref(ShipmentFilterDateEndType.EXPECTED);
// 
watch(type, () => setTimeout(() => emit('update:rsql', rsql.value), 10));
watch(rsql, (rsql) => emit('update:rsql', rsql));
watch(dates, (dates) => updateDates(dates));

onMounted(() => setTimeout(() => updateDates(), 10));


function updateDates(value?: DateInput) {
    const criteria = buildCriteria(value);
    emit('update:criteria', criteria);
}

function buildCriteria(value?: DateInput) {
    console.log("DATE RANGE VALUE: ", { value });
    let criteria: Criteria | undefined;
    value ??= dates.value;
    if (value) {

        criteria = { dateRange: value as any };
        // if (Array.isArray(value)) {
        //     if (type.value == ShipmentFilterDateEndType.DELIVERED) {
        //         criteria = { deliveryDate: value as any };
        //     }
        //     if (type.value == ShipmentFilterDateEndType.EXPECTED) {
        //         criteria = { fulfilmentDate: value as any };
        //     }
        // }
        // else if (typeof (value) === 'object') {
        //     const json = JSON.stringify(value);
        //     if (type.value == ShipmentFilterDateEndType.DELIVERED) {
        //         criteria = { deliveryDateRange: json as any };
        //     }
        //     if (type.value == ShipmentFilterDateEndType.EXPECTED) {
        //         criteria = { dateRange: json as any };
        //     }
        // }

        // for (const k in value) {
        //     const v = (value as any)[k];
        // }
    }
    return criteria;
}
</script>