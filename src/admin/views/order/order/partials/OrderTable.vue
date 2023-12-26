<template>
    <v-card :height="height ?? 'calc(100vh - 0px)'" color="secondary-bg" flat>

        <template v-if="pagination">
            <v-card v-if="pagination.pageInfo.totalItems" width="100%" color="transparent" flat>
                <v-card-title class="pa-0 py-md-3">
                    <v-card class="pa-3" flat>
                        <v-tabs v-model="tab" r-bg-color="primary" align-tabs="start">
                            <v-tab v-for="(channel) in pagination.items" :key="channel.id" :value="channel.id">
                                <v-list-item>
                                    <template v-slot:prepend>
                                        <v-avatar>
                                            <v-img :src="channel.typeConfig.iconImage" />
                                        </v-avatar>
                                    </template>
                                    <template v-slot:title>
                                        {{ channel.name }}
                                    </template>
                                    <!-- <template v-slot:subtitle>
                                        {{ channel.typeConfig.subtitle }}
                                    </template> -->
                                </v-list-item>
                            </v-tab>
                        </v-tabs>
                    </v-card>
                </v-card-title>

                <v-card-text class="px-0">
                    <v-card flat>
                        <v-window v-model="tab">
                            <v-window-item v-for="(channel) in pagination.items" :key="channel.id" :value="channel.id">
                                <channel-order-table :channel="channel" show-select height="calc(100vh - 230px)"/>
                            </v-window-item>
                        </v-window>
                    </v-card>
                </v-card-text>
            </v-card>
        </template>



        <v-row justify="center" align="center" class="fill-height" v-else-if="loading">
            <v-card width="400px" flat>
                <v-card-subtitle>Loading...</v-card-subtitle>
                <v-card-text>
                    <v-progress-linear indeterminate color="primary"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-row>

        <v-row justify="center" align="center" class="fill-height" v-else>
            <v-card width="400px" flat>
                <v-card-title>
                    Seems an Error Occured
                </v-card-title>
                <v-card-text>
                    <v-alert type="error" dismissible>
                        {{ error }}
                    </v-alert>
                </v-card-text>
            </v-card>
        </v-row>

        <!-- </v-card-text> -->
    </v-card>
</template>

<script lang="ts" setup>
import useSWRV from 'swrv';
import { ref } from 'vue';
import ChannelOrderTable from './ChannelOrderTable.vue';
import { getPaginatedChannels } from '../../../../repository/channel/channel_repository';

const props = defineProps<{
    height?: number | string,
}>();



const { data: pagination, isValidating: loading, error } = useSWRV(
    `/api/admin/channel/channels`,
    () => getPaginatedChannels(),
);


const tab = ref<any>();

</script>