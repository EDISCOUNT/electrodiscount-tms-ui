<template>
    <v-card flat>

        <v-chip-group v-if="pagination">
            <v-chip v-for="(channel,i) in pagination.items" :key="channel.id?? i">
                <v-list-item class="pl-1">
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
            </v-chip>
        </v-chip-group>

    </v-card>
</template>
<script lang="ts" setup>
import { getPaginatedChannels } from "@/admin/repository/channel/channel_repository";
import useSWRV from "swrv";


const props = defineProps();


const { data: pagination, isValidating: loading, error } = useSWRV(
    () => `/api/admin/channel/channels`,
    () => getPaginatedChannels(),
);

</script>