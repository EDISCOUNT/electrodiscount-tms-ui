<template>
  <v-card height="100vh" color="secondary-bg" style="overflow-y: auto;" flat>
    <v-row justify="center" align="center" class="fill-height">
      <v-card flat>
        <v-card-text>
          <storage-form @save="(data) => save(data)" :loading="isSaving" />
        </v-card-text>
      </v-card>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import StorageForm from './StorageForm.vue';
import { ref } from 'vue';
import { createStorage, StorageFormData } from '@/admin/repository/inventory/storage_repository';
import { useRouter } from 'vue-router';



const props = defineProps<{
}>()
const router = useRouter();

const isSaving = ref(false);


async function save(data: StorageFormData) {
  try {
    isSaving.value = true;
    const result = await createStorage(data);
    router.back();
  }
  catch (err) {

  }
  finally {
    isSaving.value = false;
  }
}
</script>