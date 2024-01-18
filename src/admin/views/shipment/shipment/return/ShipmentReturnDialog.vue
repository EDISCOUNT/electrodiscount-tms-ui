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
                <ShipmentReturnForm ref="form" v-model:selected="selectedItems" :shipment="shipment" />
            </v-card-text>
            <v-card-actions>
                <v-row justify="center">
                    <v-btn :disabled="(selectedItems?.length ?? 0) <= 0" @click="() => save()" :loading="saving"
                        color="primary">
                        Return Selected
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import ShipmentItem from '@/model/shipment/shipment_item';
import ShipmentReturnForm from './ShipmentReturnForm.vue';
import { createReturnShipment } from '@/admin/repository/shipment/shipment_repository';
import { ref, watch } from 'vue';
import { useNotifier } from 'vuetify-notifier';
import { useRouter } from 'vue-router';

const props = defineProps<{
    shipment: Shipment,
    open?: boolean,
    showButton?: boolean,
    label?: string,
}>();

const emit = defineEmits<{
    // close: ()  void,
    (e: 'update:open', value: boolean): void,
    (e: 'returned', value: Shipment): void,

}>();


const router = useRouter();
const notifier = useNotifier();
const form = ref<typeof ShipmentReturnForm>();
const isOpen = ref(props.open);
const selectedItems = ref<string[]>(props.shipment.items.map(({ id }: ShipmentItem) => id!));

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
        const data = await form.value!.validate();
        console.log("FORM STATUS: ", { data });
        if (!data) {
            throw new Error("Form Invalid!");
        }
        const shipment = await createReturnShipment(props.shipment, data);
        emit('returned', shipment);
        saving.value = false;

        const result = await notifier.confirm({
            title: "Shipment return created",
            text: "View Shipment and edit the necessary parts",
        }, 'success');

        console.log("CREATED!!: ", { result, shipment });
        if (result && shipment?.id) {
            const { id } = shipment;
            router.push({ name: 'admin:shipment:show', params: { id } });
        }
        else {
            close();
        }



    }
    catch (err) {
        const message = (err as any)?.message ?? 'Error';
        notifier.toastError(message);
    }
    finally {
        saving.value = false;
    }
}

function close() {
    isOpen.value = false;
}
</script>