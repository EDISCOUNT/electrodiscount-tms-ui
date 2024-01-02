<template>
    <Teleport to="body">
        <v-dialog v-if="useDialog" v-model="open" location="right" width="1000px" :style="zIndex ? `z-index:${zIndex};` : undefined"
            scrollable>
            <!-- <template v-slot:prepend>
                <v-btn @click="() => toggle()" variant="flat" icon>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template> -->
            <v-card flat>
                    <v-card-text>
                        <EmailPad :shipment="shipment" :order="order" />
                    </v-card-text>
                </v-card>
        </v-dialog>

        <v-navigation-drawer v-else v-model="open" location="right" :width="800" :style="zIndex ? `z-index:${zIndex};` : undefined"
            temporary>
            <!-- <template v-slot:prepend>
                <v-btn @click="() => toggle()" variant="flat" icon>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template> -->
            <template v-slot:append>
                <v-card flat>
                    <v-card-text>
                        <EmailPad :shipment="shipment" :order="order" />
                    </v-card-text>
                </v-card>
            </template>
        </v-navigation-drawer>
    </Teleport>
    <v-btn @click="() => toggle()" color="primary" :elevation="0" variant="plain" icon>
        <v-icon>mdi-email</v-icon>
        <!-- <span v-show="smAndUp">Send Message</span> -->
    </v-btn>
</template>
<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import Order from '@/model/order/order';
import EmailPad from './EmailPad.vue';
import { ref, watch, computed } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{
    useDialog?: boolean;
    shipment?: Shipment,
    order?: Order,
    open?: boolean;
    zIndex?: number;
}>();

const emit = defineEmits<{
    (e: 'update:open', open: boolean): void;
}>();



const { smAndUp } = useDisplay();


function toggle() {
    open.value = !open.value;
}


const open = ref(false);
watch(
    () => props.open,
    (value) => open.value = value,
);
watch(open, (open) => emit('update:open', open));
</script>