<template>
  <v-card height="100vh" color="secondary-bg"  style="overflow-y: auto;" flat>
    <v-row justify="center" align="center" class="fill-height">
      <v-card flat>
        <v-card-text>
          <carrier-form @save="(data) => save(data)" :loading="isSaving" />
        </v-card-text>
      </v-card>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import CarrierForm from './CarrierForm.vue';
import { ref } from 'vue';
import { createCarrier, CarrierFormData } from '@/admin/repository/carrier/carrier_repository';
import { useRouter } from 'vue-router';
import { useNotifier } from 'vuetify-notifier';



const props = defineProps<{
}>()
const router = useRouter();
const notifier = useNotifier();

const isSaving = ref(false);


async function save(data: CarrierFormData) {
  try {
    isSaving.value = true;
    const result = await createCarrier(data);
    router.back();
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