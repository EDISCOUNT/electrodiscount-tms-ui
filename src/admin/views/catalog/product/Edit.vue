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
    <v-row justify="center" align="center" class="fill-height" v-else-if="product">
      <v-card flat>
        <v-card-text v-if="error">
          <v-alert type="error">
            {{ error }}
          </v-alert>
        </v-card-text>
        <v-card-text>
          <product-form @save="(data) => save(data)" :product="product" :loading="isSaving" />
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
import ProductForm from './ProductForm.vue';
import { onMounted, ref } from 'vue';
import { getProduct, updateProduct, ProductFormData } from '@/admin/repository/catalog/product_repository';
import Product from '@/model/catalog/product';
import { useRouter } from 'vue-router';

const props = defineProps<{
  id: string,
}>()

const product = ref<Product | null>(null);
const error = ref<string | null>(null);
const isSaving = ref(false);
const isLoading = ref(false);

const router = useRouter();



onMounted(async () => {
  await loadProduct();
});


async function save(data: ProductFormData) {
  try {
    error.value = null;
    isSaving.value = true;
    const result = await updateProduct(props.id, data);
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


async function loadProduct() {
  try {
    isLoading.value = true;
    error.value = null;
    const result = await getProduct(props.id);
    product.value = result;
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