<template>
    <v-card flat>
        <v-card-text>
            <v-card flat v-for="(item, index) in shipment?.items" :key="index">
                <v-row>
                    <v-col :cols="12" :md="6">
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon>mdi-package-variant-closed</v-icon>
                            </template>
                            <template v-slot:title>
                                <template v-if="item?.sku">
                                    <strong>{{ item.sku }}</strong>
                                </template>
                                <span class="text-grey" v-else>N/A</span>
                            </template>
                            <template v-slot:subtitle>
                                <span>SKU</span>
                            </template>
                        </v-list-item>
                    </v-col>

                    <v-col :cols="12" :md="6">
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon>mdi-package-variant</v-icon>
                            </template>
                            <template v-slot:title>
                                <template v-if="item?.name">
                                    <strong>{{ item.name }}</strong>
                                </template>
                                <span class="text-grey" v-else>N/A</span>
                            </template>
                            <template v-slot:subtitle>
                                <span>Name</span>
                            </template>
                        </v-list-item>
                    </v-col>

                    <v-col :cols="12" :md="6">
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon>mdi-package-variant</v-icon>
                            </template>
                            <template v-slot:title>
                                <template v-if="item?.quantity">
                                    <strong>{{ item.quantity }}</strong>
                                </template>
                                <span class="text-grey" v-else>N/A</span>
                            </template>
                            <template v-slot:subtitle>
                                <span>Quantity</span>
                            </template>
                        </v-list-item>
                    </v-col>

                    <v-col :cols="12" :md="6">
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon>mdi-package-variant</v-icon>
                            </template>
                            <template v-slot:title>
                                <template v-if="item?.weight">
                                    <strong>{{ item.weight }} KG</strong>
                                </template>
                                <span class="text-grey" v-else>N/A</span>
                            </template>
                            <template v-slot:subtitle>
                                <span>Weight</span>
                            </template>
                        </v-list-item>
                    </v-col>
                </v-row>
            </v-card>
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';

const props = defineProps<{
    shipment: Shipment;
}>();

</script>