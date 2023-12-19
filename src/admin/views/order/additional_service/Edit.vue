<template>
  <v-card flat>
    <v-card v-if="isLoading" flat>
      <v-card-subtitle>
        Please wait...
      </v-card-subtitle>
    </v-card>

    <v-card flat v-else-if="service">
      <v-card-text v-if="error">
        <v-alert type="error">
          {{ error }}
        </v-alert>
      </v-card-text>
      <addition-service-form @save="(data) => save(data)" :channel="service" :loading="isSaving" />
    </v-card>

    <v-card v-else flat>
      <v-card-title>
        Seems and error occurred
      </v-card-title>
      <v-card-subtitle v-if="error">
        {{ error }}
      </v-card-subtitle>
    </v-card>
  </v-card>
</template>

<script lang="ts" setup>
import AdditionalServiceForm from './AdditionalServiceForm.vue';
import { onMounted, ref } from 'vue';
import { getAdditionalService, updateAdditionalService, AdditionalServiceFormData } from '@/admin/repository/order/additional_service_repository';
import AdditionalService from '@/model/order/additional_service';
import { useRouter } from 'vue-router';

const props = defineProps<{
  id: string,
}>()

const service = ref<AdditionalService | null>(null);
const error = ref<string | null>(null);
const isSaving = ref(false);
const isLoading = ref(false);

const router = useRouter();



onMounted(async () => {
  await loadAdditionalService();
});


async function save(data: AdditionalServiceFormData) {
  try {
    error.value = null;
    isSaving.value = true;
    const result = await updateAdditionalService(props.id, data);
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


async function loadAdditionalService() {
  try {
    isLoading.value = true;
    error.value = null;
    const result = await getAdditionalService(props.id);
    service.value = result;
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