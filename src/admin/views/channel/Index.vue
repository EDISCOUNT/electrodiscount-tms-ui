<template>
    <v-card height="100vh" color="secondary-bg" flat>
        <v-card-text>
            <v-card class="" flat>
                <template v-slot:title>
                    <span> Channels Index</span>
                </template>

                <template v-slot:append>
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" color="primary" :elevation="0">
                                New Channel <v-divider vertical />
                                <v-icon>mdi-menu-down</v-icon>
                            </v-btn>
                        </template>
                        <v-card flat>
                            <v-card-subtitle>
                                Create a new channel
                            </v-card-subtitle>
                            <v-card-text class="">
                                <v-list>
                                    <div v-for="(type, i) in types" :key="type.code ?? i">
                                        <v-list-item :to="{ name: 'admin:channel:create', params: { type: type.code } }">
                                            <template v-slot:prepend>
                                                <v-avatar>
                                                    <v-img :src="type.iconImage" />
                                                </v-avatar>
                                            </template>
                                            <template v-slot:title>
                                                {{ type.title }}
                                            </template>
                                            <template v-slot:subtitle>
                                                {{ type.subtitle }}
                                            </template>
                                        </v-list-item>
                                    </div>
                                </v-list>
                            </v-card-text>

                        </v-card>
                    </v-menu>
                </template>
            </v-card>

            <v-card class="mt-4 fill-height" flat>
                <v-card-text>
                    <channel-table />
                </v-card-text>
            </v-card>

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import ChannelTable from './partials/ChannelTable.vue';




const types = [
    {
        title: 'Bol.com',
        subtitle: 'Bol.com Marketplace',
        iconImage: 'http://localhost:8000/images/icons/bol.webp',
        code: 'app.shipment.sourcing.source.bol_dot_com',
    }
]

</script>