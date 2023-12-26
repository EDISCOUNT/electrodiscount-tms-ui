<template>
    <v-card flat>
        <v-card-text>
            <v-row>
                <v-col :cols="12" :md="6">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon>mdi-history</v-icon>
                        </template>
                        <template v-slot:title>
                            <template v-if="fulfilment?.exactDeliveryDate">
                                <strong>{{ formatDate(fulfilment?.exactDeliveryDate) }}</strong>
                            </template>
                            <span class="text-grey" v-else></span>

                        </template>
                        <template v-slot:subtitle>
                            <span>Exact Delivery Date</span>
                        </template>
                    </v-list-item>
                </v-col>

                <v-col :cols="12" :md="6">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon>mdi-history</v-icon>
                        </template>
                        <template v-slot:title>
                            <template v-if="fulfilment?.latestDeliveryDate">
                                <strong>{{ formatDate(fulfilment?.latestDeliveryDate) }}</strong>
                            </template>
                            <span class="text-grey" v-else></span>
                        </template>
                        <template v-slot:subtitle>
                            <span>Lastest Delivery Date</span>
                        </template>
                    </v-list-item>
                </v-col>
                <v-col :cols="12" :md="6">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon>mdi-history</v-icon>
                        </template>
                        <template v-slot:title>
                            <template v-if="fulfilment?.expiryDate">
                                <strong>{{ formatDate(fulfilment?.expiryDate) }}</strong>
                            </template>
                            <span class="text-grey" v-else></span>
                        </template>
                        <template v-slot:subtitle>
                            <span>Expiry Date</span>
                        </template>
                    </v-list-item>
                </v-col>

                <v-col :cols="12" :md="6">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-icon>mdi-group</v-icon>
                        </template>
                        <template v-slot:title>
                            <template v-if="fulfilment?.timeFrameType">
                                <strong>{{ fulfilment.timeFrameType }}</strong>
                            </template>
                            <span class="text-grey" v-else></span>
                        </template>
                        <template v-slot:subtitle>
                            <span>Delivery Type</span>
                        </template>
                    </v-list-item>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>

import ShipmentFulfilment from '@/model/shipment/shipment_fulfilment';
import { formatDate } from '@/utils/format';

const props = defineProps<{
    fulfilment?: ShipmentFulfilment;
}>();


</script>