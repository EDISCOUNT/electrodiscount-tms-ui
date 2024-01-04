<template>
    <v-card flat>
        <v-list-item r-:height="height ?? '200px'" flat>
            <template v-slot:prepend>
                <v-avatar color="primary">

                    <v-progress-circular v-if="loading" indeterminate />
                    <span class="text-h4" v-else>
                        <!-- 0 -->
                        {{ pagination?.pageInfo?.totalItems }}
                    </span>
                </v-avatar>
            </template>
            <template v-slot:title>
                <slot name="title">

                </slot>
            </template>
            <template v-slot:subtitle>
                <slot name="subtitle">
                    Items Count
                </slot>
            </template>
        </v-list-item>
    </v-card>
</template>

<script lang="ts" setup generic="T">
import Pagination from '@/data/pagination';
import useSWRV from 'swrv';


const props = defineProps<{
    height?: string;
    uri: string;
    fetcher: () => Promise<Pagination<T>>
}>();

const slots = defineSlots<{
    default: any;
    title: any;
    subtitle: any,
}>();

const { data: pagination, isValidating: loading } = useSWRV(
    () => props.uri,
    () => props.fetcher(),
);

</script>