<template>
    <v-card flat>
        <template v-slot:title>
            <span>Message the Client</span>
        </template>
        <v-card-text>
            <v-textarea :rows="10" label="Messages" variant="outlined"/>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import { ref, watch, computed } from 'vue';

const props = defineProps<{
    shipment: Shipment,
}>();

const emit = defineEmits<{
}>();

</script>