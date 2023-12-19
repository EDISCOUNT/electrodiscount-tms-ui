<template>
  <v-card flat>
    <additional-service-form @save="(data) => save(data)" :loading="isSaving"/>
  </v-card>
</template>

<script lang="ts" setup>
import AdditionalServiceForm from './AdditionalServiceForm.vue';
import { ref } from 'vue';
import { createAdditionalService, AdditionalServiceFormData } from '@/admin/repository/order/additional_service_repository';

const props = defineProps<{
}>()


const isSaving = ref(false);


async function save(data: AdditionalServiceFormData){
  try{
    isSaving.value = true;
    const result = await createAdditionalService(data);

  }
  catch(err){

  }
  finally{
    isSaving.value = false;
  }
}
</script>