<template>
  <v-card color="secondary-bg" min-height="100vh" flat>
    <v-card-text class="pa-0 pb-5">
      <shipment-form @save="(data) => save(data)" :loading="isSaving" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import ShipmentForm from './ShipmentForm.vue';
import { ref } from 'vue';
import { createShipment, } from '@/admin/repository/shipment/shipment_repository';
import { getShipmentSourceById, getShipmentSourceByCode } from '@/admin/repository/shipment/shipment_source_repository';
import useSWRV from 'swrv';
import { useRouter } from 'vue-router';
import { useNotifier } from 'vuetify-notifier';
import { ShipmentFormData } from '@/model/shipment/shipment';


const props = defineProps<{
}>()

const router = useRouter();
const notifier = useNotifier();


const isSaving = ref(false);
async function save(data: ShipmentFormData) {
  try {
    isSaving.value = true;
    const result = await createShipment(data);
    notifier.toastSuccess('Shipment created successfully');
    await router.replace({ name: 'admin:shipment:edit', params: { id: result.id } });
  }
  catch (err) {
    const message = (err as any).message;
    notifier.toastError(message);
  }
  finally {
    isSaving.value = false;
  }
}
</script>