<template>
    <EntityPageCount :fetcher="() => getPaginatedShipments({ criteria, limit: 1 })"
        :uri="`/api/admin/shipment/shipments?filter=${criteria.filter}`">
        <template v-slot:default="{ pagination, loading }">
            <v-badge color="primary" :content="pagination?.pageInfo?.totalItems ?? 0" floating>
                <!-- <v-icon icon="mdi-post"></v-icon> -->
                <span class="text-grey">
                    {{ status }}
                </span>
            </v-badge>
        </template>
    </EntityPageCount>
</template>

<script lang="ts" setup>
import { getPaginatedShipments } from '@/admin/repository/shipment/shipment_repository';
import EntityPageCount from './EntityPageCount.vue';
import Carrier from '@/model/carrier/carrier';
import { computed } from 'vue';
import { and, comparison, eq } from 'rsql-builder';

const props = defineProps<{
    status: string;
    carrier: Carrier | string;
}>();


const criteria = computed(() => {

    const carrierId = (props.carrier instanceof Carrier) ? props.carrier.id : props.carrier;

    return {
        filter: and(
            comparison('status', eq(props.status)),
            comparison('carrier.id', eq(carrierId)),
        )
    }

});

</script>