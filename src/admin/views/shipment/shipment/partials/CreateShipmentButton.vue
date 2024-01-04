<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <slot name="activator" v-bind="{ props, to: { name: 'admin:shipment:create' } }">
                <v-btn v-bind="props" color="primary" :elevation="0" variant="flat">
                    New <v-divider vertical />
                    <v-icon>mdi-menu-down</v-icon>
                </v-btn>
            </slot>
        </template>
        <v-card flat>
            <v-card-text>

                <v-card-actions>
                    <v-btn :to="{ name: 'admin:shipment:create' }" color="primary" variant="flat" :elevation="0" block>
                        Create Shipment Manualy
                    </v-btn>
                </v-card-actions>
                <v-divider class="my-3" />
                <v-card-subtitle>
                    Import from your channels
                </v-card-subtitle>
                <v-card-text class="pa-0">

                    <!-- {{ { channels, loading, error } }} -->
                    <v-list v-if="pagination">
                        <div v-for="(channel, i) in pagination.items" :key="channel.code ?? channel.id ?? i">
                            <v-list-item @click="() => openChannelOrders(channel)">
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
                        </div>
                    </v-list>
                </v-card-text>
            </v-card-text>
        </v-card>
    </v-menu>

    <v-bottom-sheet v-model="isChannelOpen">
        <v-card v-if="previewChannel" flat>
            <template v-slot:prepend>
                <v-icon size="x-large">mdi-plus-circle</v-icon>
            </template>
            <template v-slot:title>
                <ChannelListItem :channel="previewChannel" />
            </template>
            <template v-slot:append>
                <v-btn @click="() => isChannelOpen = !isChannelOpen" variant="plain" icon>
                    <v-icon size="x-large">mdi-close</v-icon>
                </v-btn>
            </template>
            <v-card-text>
                <ChannelOrderTable :channel="previewChannel" show-select/>
            </v-card-text>
        </v-card>
    </v-bottom-sheet>
</template>

<script lang="ts" setup>
import { getPaginatedChannels } from '@/admin/repository/channel/channel_repository';
import Channel from '@/model/channel/channel';
import useSWRV from 'swrv';
import { ref } from 'vue';
import ChannelOrderTable from '@/admin/views/order/order/partials/ChannelOrderTable.vue';
import ChannelListItem from '@/admin/views/channel/partials/ChannelListItem.vue';

const { data: pagination, isValidating: loading, error } = useSWRV(
    `/api/admin/channel/channels`,
    () => getPaginatedChannels(),
);




const previewChannel = ref<Channel>();
const isChannelOpen = ref(false);

function openChannelOrders(channel: Channel) {
    previewChannel.value = channel;
    isChannelOpen.value = true;
}

</script>