<template>
    <Teleport to="body">
    <v-navigation-drawer v-model="open" location="right" :width="500" temporary>
        <ShipmentEmailPad :shipment="shipment"/>
    </v-navigation-drawer>
    </Teleport>
    <v-btn @click="() => toggle()" color="primary">
                Open Message Box
            </v-btn>
</template>
<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import ShipmentEmailPad from './ShipmentEmailPad.vue';
import { ref, watch, computed } from 'vue';

const props = defineProps<{
    shipment: Shipment,
    open?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:open', open: boolean): void;
}>();


function toggle(){
    open.value = !open.value;
}


const open = ref(false);
watch(
    () => props.open,
    (value) => open.value = value,
);
watch(open, (open) => emit('update:open', open));
</script>