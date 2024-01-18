<template>
    <!--  -->
    <v-card flat>
        <!-- {{ {data, product, item} }} -->
        <v-card-text class="pa-0">
            <!-- <v-card color="grey-lighten-4" flat>
                <v-card-text>
                    <v-card-title>
                        <span>Item</span>
                    </v-card-title> -->
            <v-card-text>
                <ProductInput v-model="data.product" label="Product" placeholder="Start typing to search for products..."
                    variant="outlined" density="compact" clearable />
                <v-row class="mb-2">
                    <v-col>
                        <v-divider />
                    </v-col>
                    <span>
                        OR
                    </span>
                    <v-col>
                        <v-divider />
                    </v-col>
                </v-row>
                <v-text-field v-model="data.name" label="Product Name" variant="outlined" density="comfortable" type="text"
                    :counter="255" :disabled="!!data.product" :rules="[
                        (v) => !!data.product || !!v || 'Either or both Product and Product Name is required',
                        (v) => data.product || (v && (v.length <= 255)) || 'Product Name must be less than or equal to 255 characters'
                    ]" clearable />
            </v-card-text>
            <v-divider class="mb-4" />
            <v-card-text class="py-0">
                <!-- {{ { product: data.product } }} -->
                <v-text-field v-model="data.quantity" label="Quantity" variant="outlined" density="compact" type="number"
                    :min="1" :step="1" :rules="[
                        (v) => !!v || 'Quantity is required',
                        (v) => (v && v >= 1) || 'Quantity must be greater than or equal to 1'
                    ]" />
            </v-card-text>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import Product from '@/model/catalog/product';
import ProductInput from './ProductInput.vue';
import { reactive, defineProps, watch } from 'vue';
// import { ShipmentItemFormData } from '@/admin/repository/shipment/shipment_repository';
import ShipmentItem, { ShipmentItemFormData } from '@/model/shipment/shipment_item';


const props = defineProps<{
    product?: Product;
    item?: ShipmentItem;
    modelValue?: ShipmentItemFormData;
}>();

const emit = defineEmits<{
    (e: 'update:model-value', value?: ShipmentItemFormData): void;
}>();

const data = reactive<ShipmentItemFormData>({
    name: props.item?.name,
    product: props.product?.id ?? props.item?.product?.id,
    quantity: 1,
});


let is_updating_value = false;
watch(data, data => emit('update:model-value', data));
watch(
    () => props.modelValue,
    (input) => {
        if (is_updating_value) {
            return;
        }
        is_updating_value = true;
        for (const key in data) {
            (data as any)[key] = ((input ?? {}) as any)[key];
        }
        setTimeout(() => is_updating_value = false, 100);
    }
)

</script>