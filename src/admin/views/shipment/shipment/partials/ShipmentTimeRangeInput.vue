<template>
    <v-card flat>
        <v-form ref="form">
            <v-card-subtitle>
                Expectedt Time of Arrival(ETA)
            </v-card-subtitle>
            <v-card-text>
                <v-row>
                    <v-col :cols="12" :md="10">
                        <DateTimeRangeInput v-model="data" variant="outlined" density="compact" />
                    </v-col>

                    <v-col :cols="12" :md="2">
                        <v-btn color="primary" @click="() => updateTimeRange()" :elevation="0" :loading="isSaving"
                            variant="flat">
                            Save
                            <v-icon>mdi-save</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-form>
    </v-card>
</template>
<script lang="ts" setup>
import { updateShipment } from '@/admin/repository/shipment/shipment_repository';
import Shipment from '@/model/shipment/shipment';
import { error } from 'console';
import { onMounted, ref, watch } from 'vue';
import { useNotifier } from 'vuetify-notifier';
import DateTimeRangeInput from '@/components/Input/DateTimeRangeInput.vue';
import { VForm } from 'vuetify/lib/components/index.mjs';


interface TimeRangeInput {
    startAt?: Date;
    endAt?: Date;

}

const props = defineProps<{
    // modelValue?: TimeRangeInput;
    shipment: Shipment;
}>();

const emit = defineEmits<{
    (e: 'update:shipment', shipment: Shipment): void;
}>();


const notifier = useNotifier();

const form = ref<VForm>();
const data = ref<any>();
const isSaving = ref(false);

watch(
    () => props.shipment,
    (shipment) => updateTimeRangeFromShipment(shipment),
);

onMounted(() => updateTimeRangeFromShipment(props.shipment));

async function updateTimeRange(fulfilmentTimeRange?: TimeRangeInput) {
    try {
        fulfilmentTimeRange ??= data.value!;
        const { valid, errors } = await form.value!.validate();
        if (!valid) {
            throw new Error("Validation error");
        }
        isSaving.value = true;
        const result = await updateShipment((props.shipment.id as any)!, { fulfilmentTimeRange });
        notifier.toastSuccess('Shipment Time indication updated successfully');
        // router.back();
        onUpdateShipment(result);

    }
    catch (err) {
        const message = (err as any).message as string;
        // error.value = message;
        notifier.toastError(message);
    }
    finally {
        isSaving.value = false;
    }

}

function updateTimeRangeFromShipment(shipment: Shipment) {
    data.value = shipment.fulfilmentTimeRange?.toJson()?? {};
}

function onUpdateShipment(shipment: Shipment) {
    emit('update:shipment', shipment);
}

</script>