<template>
    <v-card class="fill-height" flat>
        <v-card-text v-if="shipment.originAddress">
            <v-card variant="outlined" style="border-width: 0.05px;" flat rounded>
                <v-card-title>
                    <v-row justify="space-between" class="pa-5">
                        <span>Pickup</span>
                        <v-chip>
                            {{ shipment?.originAddress.postcode }}
                        </v-chip>
                    </v-row>
                </v-card-title>
                <v-card-subtitle v-if="shipment?.originAddress.fullName">
                    <strong class="text-black">{{ shipment.originAddress.fullName }}</strong>
                </v-card-subtitle>
                <v-card-subtitle v-if="shipment?.originAddress.company">
                    <strong class="text-green">{{ shipment.originAddress.company }}</strong>
                </v-card-subtitle>
                <v-card-text class="pt-2">
                    {{ shipment?.originAddress.label }}
                </v-card-text>
            </v-card>
        </v-card-text>

        <v-card-text v-if="shipment.destinationAddress">
            <v-card variant="outlined" style="border-width: 0.05px;" flat rounded>
                <v-card-title>
                    <v-row justify="space-between" class="pa-5">
                        <span>Delivery</span>
                        <v-chip>
                            {{ shipment?.destinationAddress.postcode }}
                        </v-chip>
                    </v-row>
                </v-card-title>
                <v-card-subtitle v-if="shipment?.destinationAddress.fullName">
                    <strong class="text-black">{{ shipment.destinationAddress.fullName }}</strong>
                </v-card-subtitle>
                <v-card-subtitle v-if="shipment?.destinationAddress.company">
                    <strong class="text-green">{{ shipment.destinationAddress.company }}</strong>
                </v-card-subtitle>
                <v-card-text class="pt-2">
                    {{ shipment?.destinationAddress.label }}
                </v-card-text>
            </v-card>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';

const props = defineProps<{
    shipment: Shipment
}>();
</script>