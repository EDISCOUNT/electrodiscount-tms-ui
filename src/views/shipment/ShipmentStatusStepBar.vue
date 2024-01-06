<template>
    <v-stepper :model-value="value" :mobile="xs" alt-labels>
        <v-stepper-header>
            <v-stepper-item :value="1" :complete="value > 1" title="Processing">
                <template v-if="value > 1" v-slot:subtitle>
                    <span class="text-grey">
                        Done!
                    </span>
                </template>
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item v-if="isOnHold" :value="2" :complete="value > 2" title="On Hold" color="orange">
            </v-stepper-item>
            <v-stepper-item  v-else :value="2" :complete="value > 2" title="Pick up/In Transit">
                <template v-slot:subtitle>
                    <template v-if="shipment.bookedAt">
                        {{ formatDate(shipment.bookedAt) }}
                    </template>
                    <span class="text-grey" v-else>
                    </span>
                </template>
            </v-stepper-item>
            <v-divider></v-divider>


            <v-stepper-item v-if="isCancelled || isRejected" color="red" :value="3" :title="shipment.status">
            </v-stepper-item>

            <!-- <v-stepper-item v-else-if="isOnHold" color="orange" :value="3" title="On Hold">
            </v-stepper-item> -->

            <v-stepper-item v-else :value="3" :complete="value >= 3" title="Delivery Completed">
                <template v-slot:subtitle>
                    <template v-if="shipment.bookedAt">
                        {{ formatDate(shipment.bookedAt) }}
                    </template>
                    <span class="text-grey" v-else>
                    </span>
                </template>
            </v-stepper-item>
           
            <!-- <v-divider></v-divider> -->
        </v-stepper-header>
    </v-stepper>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import { formatDate } from '@/utils/format';
import { computed, toRefs } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{
    shipment: Shipment
}>();

// const { shipment } = toRefs(props);

const statusMap = {
    'new': 1,
    'assigned': 1,
    'intransit': 2,
    'onhold': 2,
    'delivered': 3,
    'rejected': 3,//4,
    'cancelled': 3,//4,
    'completed': 3, //4,
}


const isDelivered = computed(() => {
    return props.shipment.status === 'delivered';
});

const isOnHold = computed(() => {
    return props.shipment.status === 'onhold';
});

const isRejected = computed(() => {
    return props.shipment.status === 'rejected';
});

const isCancelled = computed(() => {
    return props.shipment.status === 'cancelled';
});


const value = computed(() => {
    return getValue(props.shipment.status);
});

function getValue(status: string) {
    return (statusMap as any)[status] ?? 0 as number;
}

function getStepColor(step: number) {
    if (step < value.value) {
        return 'green';
    } else if (step === value.value) {
        return 'blue';
    } else {
        return 'grey';
    }
}

const { xs } = useDisplay();

</script>