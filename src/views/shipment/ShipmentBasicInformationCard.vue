<template>
    <v-card flat>
        <v-card-text>
            <v-row>
                <v-col :cols="12" :md="6">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon>mdi-category</v-icon>
                        </template>
                        <template v-slot:title>
                            <template v-if="shipment?.code">
                                <strong>{{ shipment.code }}</strong>
                            </template>
                            <span class="text-grey" v-else>N/A</span>
                        </template>
                        <template v-slot:subtitle>
                            <span>Shipment Code(Reference)</span>
                        </template>
                    </v-list-item>
                    </v-col>

                    <v-col :cols="12" :md="6">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon>mdi-label</v-icon>
                        </template>
                        <template v-slot:title>
                            <template v-if="shipment?.channelOrderId">
                                <strong>{{ shipment.channelOrderId }}</strong>
                            </template>
                            <span class="text-grey" v-else>N/A</span>
                        </template>
                        <template v-slot:subtitle>
                            <span>Order ID</span>
                        </template>
                    </v-list-item>
                    </v-col>

                    <v-col :cols="12" :md="6">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon>mdi-label</v-icon>
                        </template>
                        <template v-slot:title>
                            <template v-if="shipment?.netWeight">
                                <strong>{{ shipment.netWeight }} KG</strong>
                            </template>
                            <span class="text-grey" v-else>N/A</span>
                        </template>
                        <template v-slot:subtitle>
                            <span>Net Weight</span>
                        </template>
                    </v-list-item>
                    </v-col>

                    <v-col :cols="12" :md="6">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon>mdi-weight</v-icon>
                        </template>
                        <template v-slot:title>
                            <template v-if="shipment?.volumetricWeight">
                                <strong>{{ shipment.volumetricWeight }} KG</strong>
                            </template>
                            <span class="text-grey" v-else>N/A</span>
                        </template>
                        <template v-slot:subtitle>
                            <span>Volumetric Weight</span>
                        </template>
                    </v-list-item>
                    </v-col>

                    
                    <v-col :cols="12" :md="6">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon>mdi-dimension</v-icon>
                        </template>
                        <template v-slot:title>
                            <template v-if="shipment?.dimension">
                                <strong>{{ shipment.dimension.label }}</strong>
                            </template>
                            <span class="text-grey" v-else>N/A</span>
                        </template>
                        <template v-slot:subtitle>
                            <span>Dimension</span>
                        </template>
                    </v-list-item>
                    </v-col>
                    <v-col :cols="12" :md="6">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon>mdi-dimension</v-icon>
                        </template>
                        <template v-slot:title>
                            <template v-if="shipment?.codAmount">
                                <strong>{{ shipment.codAmount }}</strong>
                            </template>
                            <span class="text-grey" v-else>N/A</span>
                        </template>
                        <template v-slot:subtitle>
                            <span>COD Amount</span>
                        </template>
                    </v-list-item>
                    </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import Shipment from '@/model/shipment/shipment';
import { formatDate } from '@/utils/format';

const props = defineProps<{
    shipment: Shipment;
}>();

</script>