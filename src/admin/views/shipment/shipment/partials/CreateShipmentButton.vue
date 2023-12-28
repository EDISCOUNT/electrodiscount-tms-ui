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
                    Create from your channels
                </v-card-subtitle>
                <v-card-text class="pa-0">

                    <!-- {{ { channels, loading, error } }} -->
                    <v-list v-if="pagination">
                        <div v-for="(channel, i) in pagination.items" :key="channel.code ?? channel.id ?? i">
                            <v-list-item :to="{ name: 'admin:shipment:create', }">
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
</template>

<script lang="ts" setup>
import { getPaginatedChannels } from '@/admin/repository/channel/channel_repository';
import useSWRV from 'swrv';

const { data: pagination, isValidating: loading, error } = useSWRV(
    `/api/admin/channel/channels`,
    () => getPaginatedChannels(),
);

</script>