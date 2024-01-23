<template>
  <v-card height="100vh" color="secondary-bg" flat>

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
    <v-row justify="center" align="center" class="fill-height" v-else-if="category">
      <v-card flat>
        <v-card-text v-if="error">
          <v-alert type="error">
            {{ error }}
          </v-alert>
        </v-card-text>
        <v-card-text>
          <category-form @save="(data) => save(data)" :category="category" :loading="isSaving" />
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
import CategoryForm from './CategoryForm.vue';
import { onMounted, ref } from 'vue';
import { getCategory, updateCategory, CategoryFormData } from '@/admin/repository/catalog/category_repository';
import Category from '@/model/catalog/category';
import { useRouter } from 'vue-router';

const props = defineProps<{
  id: string,
}>()

const category = ref<Category | null>(null);
const error = ref<string | null>(null);
const isSaving = ref(false);
const isLoading = ref(false);

const router = useRouter();



onMounted(async () => {
  await loadCategory();
});


async function save(data: CategoryFormData) {
  try {
    error.value = null;
    isSaving.value = true;
    const result = await updateCategory(props.id, data);
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


async function loadCategory() {
  try {
    isLoading.value = true;
    error.value = null;
    const result = await getCategory(props.id);
    category.value = result;
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