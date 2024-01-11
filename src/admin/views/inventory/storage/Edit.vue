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
    <v-row justify="center" align="center" class="fill-height" v-else-if="storage">
      <v-card flat>
        <v-card-text v-if="error">
          <v-alert type="error">
            {{ error }}
          </v-alert>
        </v-card-text>
        <v-card-text>
          <storage-form @save="(data) => save(data)" :storage="storage" :loading="isSaving" />
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
import StorageForm from './StorageForm.vue';
import { onMounted, ref } from 'vue';
import { getStorage, updateStorage, StorageFormData } from '@/admin/repository/inventory/storage_repository';
import Storage from '@/model/inventory/storage';
import { useRouter } from 'vue-router';

const props = defineProps<{
  id: string,
}>()

const storage = ref<Storage | null>(null);
const error = ref<string | null>(null);
const isSaving = ref(false);
const isLoading = ref(false);

const router = useRouter();



onMounted(async () => {
  await loadStorage();
});


async function save(data: StorageFormData) {
  try {
    error.value = null;
    isSaving.value = true;
    const result = await updateStorage(props.id, data);
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


async function loadStorage() {
  try {
    isLoading.value = true;
    error.value = null;
    const result = await getStorage(props.id);
    storage.value = result;
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