<template>
    <v-chip :value="value" label :color="isSelected ? 'primary' : undefined" :elevation="0">
        <slot>
            {{ value }}
        </slot>
        <template v-slot:append>
            <span v-if="pagination">
                <v-avatar class="mx-1" color="grey" r-:size="15">
                    {{ pagination.count }}
                </v-avatar>
            </span>
            <v-progress-circular indeterminate :size="15" v-else />
        </template>
    </v-chip>
</template>

<script lang="ts" setup>
import { countShipments } from '@/admin/repository/shipment/shipment_repository';
import useSWRV from 'swrv';


const props = defineProps<{
    value: string;
    filter?: string;
    isSelected?: boolean;
}>();



const { data: pagination, isValidating: loading, error } = useSWRV(
    () => `/api/admin/shipment/shipments/count?status=${props.value}&filter=${props.filter}`,
    () => countShipments({ criteria: { status: props.value, filter: props.filter } }),
    {
        refreshInterval: 0,
        revalidateOnFocus: false,
        revalidateDebounce: 100,
    }
);

</script>