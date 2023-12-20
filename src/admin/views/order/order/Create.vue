<template>
  <v-card flat>
    <v-card-title>
      <v-list-item v-if="source">
        <template v-slot:prepend>
          <v-avatar>
            <v-img :src="source.iconImage" />
          </v-avatar>
        </template>
        <template v-slot:title>
          {{ source.title }}
        </template>
        <template v-slot:subtitle>
          {{ source.subtitle }}
        </template>
      </v-list-item>
      <div v-else-if="loading">
        <v-progress-linear indeterminate />
      </div>
    </v-card-title>
    <v-card-text class="pa-0">
      <order-form @save="(data) => save(data)" :type="props.type" :height="source ? 'calc(100vh - 80px)' : undefined"
        :loading="isSaving" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import OrderForm from './OrderForm.vue';
import { ref } from 'vue';
import { createOrder, OrderFormData } from '@/admin/repository/order/order_repository';
import { getShipmentSourceById, getShipmentSourceByCode } from '@/admin/repository/shipment/shipment_source_repository';
import useSWRV from 'swrv';


const props = defineProps<{
  type: string,
}>()


const { data: source, isValidating: loading, error } = useSWRV(
  () => `/api/admin/shipment/sources/${props.type}`,
  () => getShipmentSourceByCode(props.type));


const isSaving = ref(false);
async function save(data: OrderFormData) {
  try {
    isSaving.value = true;
    const result = await createOrder(data);

  }
  catch (err) {

  }
  finally {
    isSaving.value = false;
  }
}
</script>