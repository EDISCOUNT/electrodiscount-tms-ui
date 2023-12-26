<template>
    <v-stepper :mobile="xs" alt-labels>
        <v-stepper-header>
            <v-stepper-item value="1" complete title="Book Shipment">
                <template v-slot:subtitle>
                    <template v-if="shipment.bookedAt">
                        {{ formatDate(shipment.bookedAt) }}
                    </template>
                    <span class="text-grey" v-else>
                    </span>
                </template>
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item value="2" title="Processing">
                <template v-slot:subtitle>
                    <span class="text-grey">
                        Done!
                    </span>
                </template>
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item value="2" title="Pick up">
                <template v-slot:subtitle>
                    <template v-if="shipment.bookedAt">
                        {{ formatDate(shipment.bookedAt) }}
                    </template>
                    <span class="text-grey" v-else>
                    </span>
                </template>
            </v-stepper-item>
            <v-divider></v-divider>


            <v-stepper-item value="2" title="In Transit">
                <template v-slot:subtitle>
                </template>
            </v-stepper-item>
            <v-divider></v-divider>

            <v-stepper-item value="2" title="Delivered">
                <template v-slot:subtitle>
                    <template v-if="shipment.bookedAt">
                        {{ formatDate(shipment.bookedAt) }}
                    </template>
                    <span class="text-grey" v-else>
                    </span>
                </template>
            </v-stepper-item>
            <v-divider></v-divider>

            <v-stepper-item value="2" title="Completed">
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
import { useDisplay } from 'vuetify';

const props = defineProps<{
    shipment: Shipment
}>();




const { xs } = useDisplay();

</script>