<template>
    <v-row>
        <v-col :cols="12" :sm="2" r-:md="4" r-:lg="3">
            <v-text-field v-model="filter.code" label="Shipment Code" placeholder="Enter Shipment Code" variant="outlined"
                density="compact" clearable />
        </v-col>
        <v-col :cols="12" :sm="2" r-:md="4" r-:lg="3">
            <v-text-field v-model="filter.channelOrderId" label="Order ID" placeholder="Enter Order Id" variant="outlined"
                density="compact" clearable />
        </v-col>
        <v-col :cols="12" :sm="4" r-:md="4" r-:lg="3">
            <CarrierInput v-model="filter.carriers" label="Carriers" placeholder="Filter by assigned carriers"
                variant="outlined" density="compact" multiple clearable />
        </v-col>
        <v-col :cols="12" :sm="4" r-:md="4" r-:lg="3">
            <ChannelInput v-model="filter.channels" label="Channels" placeholder="Filter by source Channels"
                variant="outlined" density="compact" multiple clearable />
        </v-col>

        <v-col v-if="xs" :cols="12" :sm="4" r-:md="4" r-:lg="3">
            <ShipmentStatusFilter />
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue';
import CarrierInput from '../CarrierInput.vue';
import ChannelInput from '../ChannelInput.vue';
import { computed } from 'vue';
import { and, comparison, inList } from 'rsql-builder';
import { like } from '@/utils/rsql';
import { useDisplay } from 'vuetify';
import ShipmentStatusFilter from '@/views/shipment/filter/ShipmentStatusFilter.vue';

interface FilterOptions {
    channels: string[];
    carriers: string[];
    code?: string,
    channelOrderId?: string;
}

const emit = defineEmits<{
    (e: 'update:rsql', value?: string): void;
}>();


const { xs, sm, lg } = useDisplay();

const filter = reactive<FilterOptions>({
    carriers: [],
    channels: [],
});


const rsql = computed(() => {
    let query = '';
    if (filter.code) {
        query = and(query, comparison('code', like(filter.code)));
    }

    if (filter.channelOrderId) {
        query = and(query, comparison('channelOrderId', like(filter.channelOrderId)));
    }

    if (filter.carriers.length > 0) {
        query = and(query, comparison('carrier.id', inList(...filter.carriers)));
    }
    if (filter.channels.length > 0) {
        query = and(query, comparison('channel.id', inList(...filter.channels)));
    }
    return query;
});


watch(rsql, (rsql) => emit('update:rsql', rsql));


</script>