<template>
  <v-card height="100vh" color="secondary-bg" flat>
    <v-row justify="center" align="center" class="fill-height">
      <v-card flat>
        <v-card-text>
          <category-form @save="(data) => save(data)" :loading="isSaving" />
        </v-card-text>
      </v-card>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import CategoryForm from './CategoryForm.vue';
import { ref } from 'vue';
import { createCategory, CategoryFormData } from '@/admin/repository/catalog/category_repository';
import { useRouter } from 'vue-router';
import { useNotifier } from 'vuetify-notifier';



const props = defineProps<{
}>()

const notifier = useNotifier();
const router = useRouter();

const isSaving = ref(false);


async function save(data: CategoryFormData) {
  try {
    isSaving.value = true;
    const result = await createCategory(data);
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