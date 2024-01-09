<template>
    <v-card :to="{ name: 'admin:shipment:index', query: { status, ...(criteria?? {}) } }" flat>
        <EntityPageCount :fetcher="() => countShipments({ criteria: { status, filter } })"
            :uri="`/api/admin/shipment/shipments/count?status=${status}&filter=${filter}`">
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
import { getPaginatedShipments, countShipments } from '@/admin/repository/shipment/shipment_repository';
import EntityPageCount from './EntityPageCount.vue';

const props = defineProps<{
    status: string;
    filter?: string;
    criteria?: {[i:string]: any};
}>();

</script>