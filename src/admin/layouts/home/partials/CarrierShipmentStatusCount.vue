<template>
    <!-- {{ {criteria, status, dType: typeof(criteria?.dateRange)} }} -->
    <EntityPageCount :fetcher="() => countShipments({ criteria: { ...criteria, status } })!"
        :uri="`/api/admin/shipment/shipments?status=${status}&filter=${criteria.filter}&criteria=${JSON.stringify(criteria)}`">
        <template v-slot:default="{ pagination, loading }">
            <v-badge color="primary" :content="pagination?.count ?? 0" floating>
                <!-- <v-icon icon="mdi-post"></v-icon> -->
                <span class="text-grey">
                    {{ status }}
                </span>
            </v-badge>
        </template>
    </EntityPageCount>
</template>

<script lang="ts" setup>
import { getPaginatedShipments, countShipments as _countShipments } from '@/admin/repository/shipment/shipment_repository';
import EntityPageCount from './EntityPageCount.vue';
import Carrier from '@/model/carrier/carrier';
import { computed } from 'vue';
import { and, comparison, eq } from 'rsql-builder';
import { debounce } from 'lodash';

const props = defineProps<{
    status: string;
    carrier: Carrier;
    filter?: string;
    criteria?: { [i: string]: any };
}>();


const criteria = computed(() => {

    const carrierId = (props.carrier instanceof Carrier) ? props.carrier.id : props.carrier;

    return {
        ...props.criteria,
        filter: and(
            comparison('carrier.id', eq(carrierId)),
            // comparison('status', eq(props.status)),
            ...(props.filter ? [props.filter] : []),
        )
    }

});


const countShipments = debounce(_countShipments, 100);
</script>