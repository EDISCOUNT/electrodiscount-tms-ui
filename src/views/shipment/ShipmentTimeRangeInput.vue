<template>
    <v-card flat>
        <v-form ref="form">
            <v-card-subtitle>
                Expectedt Time of Arrival(ETA)
                <!-- {{ {today} }} -->
            </v-card-subtitle>
            <v-card-text>
                <v-row>
                    <v-col :cols="12" :md="4">
                        <v-text-field type="date" label="Delivery On" v-model="data.date" variant="outlined"
                            density="compact" :min="today" />
                    </v-col>
                    <v-col :cols="12" :md="3">
                        <v-text-field type="time" label="Between" v-model="data.startTime" variant="outlined" density="compact"
                            :rules="[
                                (v: any) => !!v || 'Start time is required',
                                (v: any) => !v || !data?.endTime || v < data?.endTime || 'Start time must be before end time'
                            ]" :max="data.endTime" />
                    </v-col>

                    <v-col :cols="12" :md="3">
                        <v-text-field type="time" label="And" v-model="data.endTime" variant="outlined" density="compact"
                            :rules="[
                                (v: any) => !!v || 'End date is required',
                                (v: any) => !v || !data?.startTime || v > data?.startTime || 'End time must be after start time'
                            ]" :min="data.startTime" />
                    </v-col>

                    <v-col :cols="12" :md="2">
                        <v-btn color="primary" @click="() => updateTimeRange()" :elevation="0" :loading="isSaving"
                            variant="flat">
                            Save
                            <v-icon>mdi-save</v-icon>
                        </v-btn>
                    </v-col>

                    <!-- <v-col :cols="12" :md="2">
                        <v-btn color="primary" @click="() => updateTimeRange()" :elevation="0" :loading="isSaving"
                            variant="flat">
                            Save
                            <v-icon>mdi-save</v-icon>
                        </v-btn>
                    </v-col> -->
                </v-row>
                <!-- <v-row>
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
                </v-row> -->
            </v-card-text>
        </v-form>
    </v-card>
</template>
<script lang="ts" setup>
import { updateShipment as adminUpdateShipment } from '@/admin/repository/shipment/shipment_repository';
import Shipment, { ShipmentFormData } from '@/model/shipment/shipment';
import { error } from 'console';
import { onMounted, ref, watch } from 'vue';
import { useNotifier } from 'vuetify-notifier';
// import DateTimeRangeInput from '@/components/Input/DateTimeRangeInput.vue';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { useRouter } from 'vue-router';

const today = new Date().toISOString().slice(0, 10);

// interface TimeRangeInput {
//     startAt?: Date;
//     endAt?: Date;

// }

interface TimeRangeFormData {
    date?: string;      // 2024-01-25
    startTime?: string; // 11:45 AM
    endTime?: string; // 02:30 PM

}

interface TimeRangeInput {
    startAt?: Date | string;
    endAt?: Date | string;
}

const props = defineProps<{
    // modelValue?: TimeRangeInput;
    shipment: Shipment;
    updateShipment?(id: string, data: ShipmentFormData): Promise<Shipment>;
}>();

const emit = defineEmits<{
    (e: 'update:shipment', shipment: Shipment): void;
}>();



const updateShipment = props.updateShipment ?? adminUpdateShipment;

const router = useRouter();
const notifier = useNotifier();

const form = ref<VForm>();
const data = ref<TimeRangeFormData>({});
const isSaving = ref(false);

watch(
    () => props.shipment,
    (shipment) => updateTimeRangeFromShipment(shipment),
);

onMounted(() => updateTimeRangeFromShipment(props.shipment));

async function updateTimeRange(input?: TimeRangeFormData) {
    try {
        input ??= data.value!;
        const fulfilmentTimeRange = convertFormDataToInput(input);
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
    data.value = buildData(shipment.fulfilmentTimeRange?.toJson() ?? {});
}


function convertFormDataToInput(formData: TimeRangeFormData): TimeRangeInput {
    const { date, startTime, endTime } = formData;
    const input: TimeRangeInput = {};

    if (date && startTime) {
        const startAt = new Date(`${date} ${startTime}`);
        input.startAt = startAt.toISOString();
    }

    if (endTime) {
        const endAt = new Date(`${date} ${endTime}`);
        input.endAt = endAt.toISOString();
    }

    return input;
}


function buildData(input: TimeRangeInput) {
    const { startAt, endAt } = input;
    const data: TimeRangeFormData = {};

    if (startAt) {
        const startDate = new Date(startAt);
        data.date = startDate.toISOString().slice(0, 10);
        data.startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  hour12: false  }).slice(0, 5);
    }

    if (endAt) {
        const endDate = new Date(endAt);
        data.endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  hour12: false  }).slice(0, 5);
    }

    // console.log("DATA: ", {data});

    return data;
}



function onUpdateShipment(shipment: Shipment) {
    emit('update:shipment', shipment);
}

</script>