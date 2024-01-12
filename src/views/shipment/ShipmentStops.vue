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
                    <strong class="">{{ shipment.originAddress.fullName }}</strong>
                </v-card-subtitle>
                <v-card-subtitle v-if="shipment?.originAddress.company">
                    <strong class="text-green">{{ shipment.originAddress.company }}</strong>
                </v-card-subtitle>
                <v-card-text class="pt-2">
                    {{ shipment?.originAddress.label }}
                </v-card-text>
                <v-card-text v-if="shipment?.originAddress.emailAddress || shipment?.originAddress.phoneNumber"
                    class="py-0 px-4">
                    <v-chip v-if="shipment?.originAddress.emailAddress"
                        :href="`mailto:${shipment?.originAddress.emailAddress}`" class="pl-1  ma-1" size="small">
                        <template v-slot:prepend>
                            <v-avatar color="primary" class="mr-2">
                                <v-icon>mdi-email</v-icon>
                            </v-avatar>
                        </template>
                        {{
                            shipment.originAddress.emailAddress }}</v-chip>
                    <v-chip v-if="shipment?.originAddress.phoneNumber" :href="`tel:${shipment?.originAddress.phoneNumber}`"
                        class="pl-1  ma-1" size="small">
                        <template v-slot:prepend>
                            <v-avatar color="primary" class="mr-2">
                                <v-icon>mdi-phone</v-icon>
                            </v-avatar>
                        </template>
                        {{ shipment.originAddress.phoneNumber }}
                    </v-chip>
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
                    <strong class="">{{ shipment.destinationAddress.fullName }}</strong>
                </v-card-subtitle>
                <v-card-subtitle v-if="shipment?.destinationAddress.company">
                    <strong class="text-green">{{ shipment.destinationAddress.company }}</strong>
                </v-card-subtitle>
                <v-card-text class="pt-2 pb-0">
                    {{ shipment?.destinationAddress.label }}
                </v-card-text>
                <v-card-text v-if="shipment?.destinationAddress.emailAddress || shipment?.destinationAddress.phoneNumber"
                    class="py-0 px-4">
                    <v-chip v-if="shipment?.destinationAddress.emailAddress"
                        :href="`mailto:${shipment?.destinationAddress.emailAddress}`" class="pl-1  ma-1" size="small">
                        <template v-slot:prepend>
                            <v-avatar color="primary" class="mr-2">
                                <v-icon>mdi-email</v-icon>
                            </v-avatar>
                        </template>
                        {{
                            shipment.destinationAddress.emailAddress }}</v-chip>

                    <v-chip v-if="shipment?.destinationAddress.phoneNumber"
                        :href="`tel:${shipment?.destinationAddress.phoneNumber}`" class="pl-1 ma-1" size="small">
                        <template v-slot:prepend>
                            <v-avatar color="primary" class="mr-2">
                                <v-icon>mdi-phone</v-icon>
                            </v-avatar>
                        </template>
                        {{ shipment.destinationAddress.phoneNumber }}
                    </v-chip>

                    <!-- <span v-if="shipment?.destinationAddress.phoneNumber" class="">
                        <span v-if="shipment?.destinationAddress.emailAddress" class="mr-1">,</span>
                        {{
                            shipment.destinationAddress.phoneNumber }}</span> -->
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