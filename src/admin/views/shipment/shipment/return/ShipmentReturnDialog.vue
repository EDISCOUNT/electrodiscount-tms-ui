<template>
    <!-- {{ {shipment} }} -->
    <v-dialog v-model="isOpen" max-width="1400px" min-height="600px" scrollable>
        <template v-if="showButton || $slots.activator" v-slot:activator="{ props }">
            <slot name="activator" v-bind:props="props">
                <v-btn v-bind="props" color="primary">
                    {{ label ?? 'Return' }}
                </v-btn>
            </slot>
        </template>

        <v-card flat>

            <template v-slot:prepend>
                <v-avatar :size="54" color="primary">
                    <v-icon size="x-large">mdi-truck</v-icon>
                </v-avatar>
            </template>
            <template v-slot:title>
                <span>
                    Create Return Shipment
                </span>
            </template>
            <template v-slot:append>
                <v-btn color="primary" @click="isOpen = false" variant="text" icon>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
            <v-card-text>
                <ShipmentReturnForm ref="form" :shipment="shipment" />
            </v-card-text>
            <v-card-actions>
                <v-row justify="center">
                    <v-btn @click="() => save()" :loading="saving" color="primary">
                        Return Selected
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import Shipment from '@/models/shipment/Shipment';
import ShipmentReturnForm from './ShipmentReturnForm.vue';
import { createReturnShipment} from '@/admin/repository/shipment/shipment_repository';
import { ref, watch } from 'vue';
import { useNotifier } from 'vuetify-notifier';

const props = defineProps<{
    shipment: Shipment,
    open?: boolean,
    showButton?: boolean,
    label?: string,
}>();

const emit = defineEmits<{
    // close: ()  void,
    (e: 'update:open', value: boolean): void,
}>();


const notifier = useNotifier();
const form = ref<ShipmentReturnForm>();
const isOpen = ref(props.open);

watch(() => props.open, (value) => {
    isOpen.value = value;
});

let isUpdatingdialog = false;

watch(isOpen, (open) => {
    if (!isUpdatingdialog) {
        isUpdatingdialog = true;
        emit('update:open', open);
        setTimeout(() => {
            isUpdatingdialog = false;
        }, 100);
    }
})



const saving = ref(false);

async function save() {
    try {
        saving.value = true;
        const data = await form.value.validate();
        console.log("FORM STATUS: ", { data });
        if (!data) {
            throw new Error("Form Invalid!");
        }
        await createReturnShipment(props.shipment, data);
    }
    catch (err) {
        const message = (err as any)?.message ?? 'Error';
        notifier.toastError(message);
    }
    finally {
        saving.value = false;
    }
}
</script>