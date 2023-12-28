<template>
  <v-data-table :headers="headers" :items="shipment.items">
    
    <template v-slot:item.sn="{ item : { product, name}, index }">
        {{ index + 1  }}
        </template>
    <template v-slot:item.product="{ item : { product, name}, index }">
        <span v-if="name">
            {{ name }}
            </span>
      <span v-else-if="product">{{ product.name }}</span>
        <span class="text-grey" v-else>N/A</span>
        </template>
    </v-data-table>
</template>
<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';

const props = defineProps<{
    shipment: Shipment;
}>();


const headers= [
    {
        key: 'sn', title: 'S/N', sortable: true,
    },
    {
        key: 'product', title: 'Product', sortable: true,
    },
    {
        key: 'quantity', title: 'Quantity', sortable: true,
    },
    // {
    //     key: 'actions', title: 'Actions', sortable: false,
    // }
];

</script>