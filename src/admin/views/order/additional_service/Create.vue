<template>
  <v-card height="100vh" color="secondary-bg" flat>
    <v-row justify="center" align="center" class="fill-height">
      <v-card flat>
        <v-card-text>
          <additional-service-form @save="(data) => save(data)" :loading="isSaving" />
        </v-card-text>
      </v-card>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import AdditionalServiceForm from './AdditionalServiceForm.vue';
import { ref } from 'vue';
import { createAdditionalService, AdditionalServiceFormData } from '@/admin/repository/order/additional_service_repository';
import { useRouter } from 'vue-router';



const props = defineProps<{
}>()
const router = useRouter();

const isSaving = ref(false);


async function save(data: AdditionalServiceFormData) {
  try {
    isSaving.value = true;
    const result = await createAdditionalService(data);
    router.back();
  }
  catch (err) {

  }
  finally {
    isSaving.value = false;
  }
}
</script>