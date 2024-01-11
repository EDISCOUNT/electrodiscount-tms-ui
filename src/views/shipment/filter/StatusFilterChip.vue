<template>
    <v-chip :value="value" label :color="isSelected ? 'primary' : undefined" :elevation="0">
        <slot>
            {{ value }}
        </slot>
        <template v-slot:append>
            <span v-if="pagination">
                <v-chip class="mx-1" color="grey" size="x-small" variant="flat" label>
                    {{ pagination.count }}
                </v-chip>
            </span>
            <span v-else-if="count">
                <v-chip class="mx-1" color="grey" size="x-small" variant="flat" label>
                    {{ count }}
                </v-chip>
            </span>
            <v-progress-circular indeterminate :size="15" v-else />
        </template>
    </v-chip>
</template>

<script lang="ts" setup>
// import { countShipments } from '@/admin/repository/shipment/shipment_repository';
import useSWRV from 'swrv';


const props = defineProps<{
    value: string;
    filter?: string;
    isSelected?: boolean;
    counter?: (input: { status?: string, filter?: string }) => Promise<{ count: number }>;
    count?: number;
    url: string;
}>();



const { data: pagination, isValidating: loading, error } = useSWRV(
    () => (!props.counter) ? null : `${props.url}?status=${props.value}&filter=${props.filter}`,
    () => props.counter!({ status: props.value, filter: props.filter }),
    {
        refreshInterval: 0,
        revalidateOnFocus: false,
        revalidateDebounce: 100,
    }
);


// const { data: pagination, isValidating: loading, error } = useSWRV(
//     () => `/api/admin/shipment/shipments/count?status=${props.value}&filter=${props.filter}`,
//     () => countShipments({ criteria: { status: props.value, filter: props.filter } }),
//     {
//         refreshInterval: 0,
//         revalidateOnFocus: false,
//         revalidateDebounce: 100,
//     }
// );

</script>