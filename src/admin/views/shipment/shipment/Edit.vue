<template>
  <v-card color="secondary-bg" height="100vh" flat>

    <!-- {{ { shipment } }} -->
    <v-row justify="center" align="center" v-if="isLoading" class="fill-height">
      <v-card width="400px" flat>
        <v-card-subtitle>
          Please wait...
        </v-card-subtitle>
        <v-card-text>
          <v-progress-linear indeterminate />
        </v-card-text>
      </v-card>
    </v-row>

    <v-card flat v-else-if="shipment">
      <v-card-text v-if="error">
        <v-alert type="error">
          {{ error }}
        </v-alert>
      </v-card-text>
      <shipment-form @save="(data) => save(data)" :shipment="shipment" :loading="isSaving" />
    </v-card>

    <v-row justify="center" align="center" class="fill-height" v-else>
      <v-card flat>
        <v-card-title>
          Seems and error occurred
        </v-card-title>
        <v-card-subtitle v-if="error">
          {{ error }}
        </v-card-subtitle>
      </v-card>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import ShipmentForm from './ShipmentForm.vue';
import { onMounted, ref } from 'vue';
import { getShipment, updateShipment, } from '@/admin/repository/shipment/shipment_repository';
import Shipment, { ShipmentFormData } from '@/model/shipment/shipment';
import { useRouter } from 'vue-router';
import { useNotifier } from 'vuetify-notifier';

const props = defineProps<{
  id: string,
}>()

const shipment = ref<Shipment | null>(null);
const error = ref<string | null>(null);
const isSaving = ref(false);
const isLoading = ref(false);

const router = useRouter();
const notifier = useNotifier();



onMounted(async () => {
  await loadShipment();
});


async function save(data: ShipmentFormData) {
  try {
    error.value = null;
    isSaving.value = true;
    const result = await updateShipment(props.id, data);
    notifier.toastSuccess('Shipment updated successfully');
    router.back();
  }
  catch (err) {
    const message = (err as any).message as string;
    error.value = message;
  }
  finally {
    isSaving.value = false;
  }
}


async function loadShipment() {
  try {
    isLoading.value = true;
    error.value = null;
    const result = await getShipment(props.id);
    shipment.value = result;
  }
  catch (err) {
    const message = (err as any).message as string;
    error.value = message;
  }
  finally {
    isLoading.value = false;
  }
}
</script>