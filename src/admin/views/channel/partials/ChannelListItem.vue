<template>
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
</template>

<script lang="ts" setup>
import Channel from '@/model/channel/channel';

const props = defineProps<{
    channel: Channel
}>();

</script>