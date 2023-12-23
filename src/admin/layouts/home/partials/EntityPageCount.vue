<template>
    <v-card :height="height ?? '200px'" flat>
        <template v-slot:title>
            <slot name="title">
                <v-row v-if="loading" justify="center" align="center" class="py-5">
                    <v-progress-circular indeterminate />
                </v-row>
                <span class="text-h4">
                    0
                    <!-- {{ pagination?.pageInfo?.totalRows }} -->
                </span>
            </slot>
        </template>
        <template v-slot:subtitle>
            <slot name="subtitle">
                Items Count
            </slot>
        </template>
        <v-card-text>
            <slot name="default"></slot>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup >
import Pagination from '@/data/pagination';
import useSWRV from 'swrv';


const props = defineProps<{
    height?: string;
    url: string;
    fetcher: () => Promise<Pagination<any>>
}>();

const slots = defineSlots<{
    default: any;
    title: any;
    subtitle: any,
}>();

const { data: pagination, isValidating: loading } = useSWRV(
    () => props.url,
    () => props.fetcher(),
    );

</script>