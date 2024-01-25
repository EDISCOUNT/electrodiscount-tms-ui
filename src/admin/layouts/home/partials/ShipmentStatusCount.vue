<template>
    <!-- {{ {criteria} }} -->
    <!-- {{ {criteriaParams} }} -->
    <v-card :to="{ name: 'admin:shipment:index', query: { status, ...nCriteria } }" flat>
        <EntityPageCount :fetcher="() => countShipments({ criteria: { ...criteria, status, filter } })"
            :uri="`/api/admin/shipment/shipments/count?status=${status}&${criteriaParams}`">
            <template v-slot:title>
                <slot name="title">
                    <span class="text-h4">
                        {{ status }}
                    </span>
                </slot>
            </template>

            <template v-slot:subtitle>
                <span class="text-grey">
                    Shipment Count
                </span>
            </template>
        </EntityPageCount>
    </v-card>
</template>

<script lang="ts" setup>
import { getPaginatedShipments, countShipments as _countShipments } from '@/admin/repository/shipment/shipment_repository';
import EntityPageCount from './EntityPageCount.vue';
// import { debounce } from 'lodash';
import debounce from 'debounce-promise';
import { computed } from 'vue';
import { deepEncodeURLParams } from '@/utils/url';

const props = defineProps<{
    status: string;
    filter?: string;
    criteria?: { [i: string]: any };
}>();


const nCriteria = computed(() => {
    const hash: { [i: string]: any } = {};
    for (const key in props.criteria) {
        if (key == 'filter') {
            hash[key] = props.criteria[key];
        } else {
            hash[key] = JSON.stringify(props.criteria[key]);
        }
    }

    return hash;
});

const criteriaParams = computed(() => deepEncodeURLParams(props.criteria));

const countShipments = debounce(_countShipments, 100);

</script>