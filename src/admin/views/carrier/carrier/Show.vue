<template>
  <v-card height="100vh" color="secondary-bg" style="overflow-y: auto;" flat>

    <v-row justify="center" align="center" class="fill-height" v-if="isLoading">
      <v-card width="400px" flat>
        <v-card-subtitle>
          Please wait...
        </v-card-subtitle>
        <v-card-text>
          <v-progress-linear indeterminate />
        </v-card-text>
      </v-card>
    </v-row>
    <v-row justify="center" align="center" class="fill-height" v-else-if="carrier">
      <v-card min-width="1200px" flat>
        <v-card-text v-if="error">
          <v-alert type="error">
            {{ error }}
          </v-alert>
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col :cols="12" :md="6">
              <v-card-title>
                <v-list-item>
                  <template v-slot:prepend>
                    <slot name="prepend">
                      <div v-if="carrier.logoImage">
                        <v-avatar>
                          <v-img :src="carrier.logoImage.url" />
                        </v-avatar>
                      </div>
                    </slot>
                  </template>
                  <template v-slot:title>
                    <slot name="title">
                      <span>{{ carrier.name }}</span>
                    </slot>
                  </template>
                  <template v-slot:subtitle>
                    <slot name="subtitle">
                      <span>{{ carrier.code }}</span>
                    </slot>
                  </template>
                </v-list-item>
              </v-card-title>
            </v-col>
            <v-col :cols="12" :md="6">
            </v-col>

            <v-col :cols="12" :md="12">
              <CarrierShipmentTable :carrier="carrier" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>

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
import CarrierForm from './CarrierForm.vue';
import { onMounted, ref } from 'vue';
import { getCarrier, updateCarrier, CarrierFormData } from '@/admin/repository/carrier/carrier_repository';
import CarrierShipmentTable from '../shipment/partials/CarrierShipmentTable.vue';
import Carrier from '@/model/carrier/carrier';
import { useRouter } from 'vue-router';
import { useNotifier } from 'vuetify-notifier';

const props = defineProps<{
  id: string,
}>()

const carrier = ref<Carrier | null>(null);
const error = ref<string | null>(null);
const isSaving = ref(false);
const isLoading = ref(false);

const router = useRouter();
const notifier = useNotifier();



onMounted(async () => {
  await loadCarrier();
});


async function save(data: CarrierFormData) {
  try {
    error.value = null;
    isSaving.value = true;
    const result = await updateCarrier(props.id, data);
    router.back();

  }
  catch (err) {
    const message = (err as any).message as string;
    error.value = message;
    notifier.toastError(message);
  }
  finally {
    isSaving.value = false;
  }
}


async function loadCarrier() {
  try {
    isLoading.value = true;
    error.value = null;
    const result = await getCarrier(props.id);
    carrier.value = result;
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