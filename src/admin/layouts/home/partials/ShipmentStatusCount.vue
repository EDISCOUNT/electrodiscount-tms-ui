<template>
    <EntityPageCount :fetcher="() => getPaginatedShipments({ criteria: { status }, limit: 1 })"
        :uri="`/api/admin/shipment/shipments?status=${status}`">
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
</template>

<script lang="ts" setup>
import { getPaginatedShipments } from '@/admin/repository/shipment/shipment_repository';
import EntityPageCount from './EntityPageCount.vue';

const props = defineProps<{
    status: string;
}>();

</script>