<template>
    <slot name="default" v-bind:pagination="pagination" v-bind:loading="loading">
        <!-- <v-card flat>
        <v-list-item r-:height="height ?? '200px'" flat>
            <template v-slot:prepend>
                <v-avatar color="primary">

                    <v-progress-circular v-if="loading" indeterminate />
                    <span class="text-h4" v-else>
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
    </v-card> -->

        <v-card :loading="pagination && loading" flat>
            <v-row>
                <v-col cols="3">
                    <v-card class="fill-height" flat>
                        <v-row align="center" justify="center" class="fill-height">
                            <span class="text-h4" v-if="pagination?.pageInfo">
                                {{ pagination?.pageInfo?.totalItems ?? 0 }}
                            </span>
                            <v-progress-circular v-else-if="loading" indeterminate />
                        </v-row>
                    </v-card>
                </v-col>
                <v-divider class="my-5" vertical/>
                <v-col cols="9">
                    <v-card-title>
                        <slot name="title"  v-bind:pagination="pagination" v-bind:loading="loading">
                        </slot>
                    </v-card-title>
                    <v-card-subtitle>
                        <slot name="subtitle"  v-bind:pagination="pagination" v-bind:loading="loading">
                        </slot>
                    </v-card-subtitle>
                </v-col>
            </v-row>

        </v-card>
    </slot>
</template>

<script lang="ts" setup generic="T">
import Pagination from '@/data/pagination';
import { useColorScheme } from '@/utils/color';
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
    {
        refreshInterval: 1000 * 60 * 5,
        revalidateOnFocus: false,
    }
);

const { inlineBg } = useColorScheme();

</script>