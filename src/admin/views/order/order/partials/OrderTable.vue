<template>
    <!-- {{ {channels, loading, error} }} -->
    <v-card :height="height ?? 'calc(100vh - 100px)'" color="secondary-bg" flat>
        <!-- <v-card-text> -->

        <template v-if="channels">
            <v-card v-if="channels.length" width="100%" flat>
                <v-card-text class="pa-1">
                    <!-- {{ channels }} -->

                    <v-expansion-panels>
                        <v-expansion-panel v-for="(channel) in channels" :key="channel.id">
                            <v-expansion-panel-title>
                                <v-list-item>
                                    <template v-slot:prepend>
                                        <v-avatar>
                                            <v-img :src="channel.typeConfig.iconImage" />
                                        </v-avatar>
                                    </template>
                                    <template v-slot:title>
                                        {{ channel.name }}
                                    </template>
                                    <template v-slot:subtitle>
                                        {{ channel.typeConfig.subtitle }}
                                    </template>
                                </v-list-item>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <channel-order-table :channel="channel" />
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
            </v-card>
            <v-card v-else flat>
                <v-card-title>
                    <span>No Channels</span>
                </v-card-title>
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
                    Seems and Error Occured
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



const { data: channels, isValidating: loading, error } = useSWRV(
    `/api/admin/channel/channels`,
    () => getPaginatedChannels(),
);


</script>