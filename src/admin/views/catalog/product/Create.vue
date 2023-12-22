<template>
  <v-card height="100vh" color="secondary-bg" flat>
    <v-row justify="center" align="center" class="fill-height">
      <v-card flat>
        <v-card-text>
          <product-form @save="(data) => save(data)" :loading="isSaving" />
        </v-card-text>
      </v-card>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import ProductForm from './ProductForm.vue';
import { ref } from 'vue';
import { createProduct, ProductFormData } from '@/admin/repository/catalog/product_repository';
import { useRouter } from 'vue-router';



const props = defineProps<{
}>()
const router = useRouter();

const isSaving = ref(false);


async function save(data: ProductFormData) {
  try {
    isSaving.value = true;
    const result = await createProduct(data);
    router.back();
  }
  catch (err) {

  }
  finally {
    isSaving.value = false;
  }
}
</script>