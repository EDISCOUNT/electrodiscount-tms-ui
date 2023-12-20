<template>
  <v-card flat>
    <v-card v-if="isLoading" flat>
      <v-card-subtitle>
        Please wait...
      </v-card-subtitle>
    </v-card>

    <v-card flat v-else-if="order">
      <v-card-text v-if="error">
        <v-alert type="error">
          {{ error }}
        </v-alert>
      </v-card-text>
      <order-form @save="(data) => save(data)" :order="order" :loading="isSaving" />
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
import OrderForm from './OrderForm.vue';
import { onMounted, ref } from 'vue';
import { getOrder, updateOrder, OrderFormData } from '@/admin/repository/order/order_repository';
import Order from '@/model/order/order';
import { useRouter } from 'vue-router';

const props = defineProps<{
  id: string,
}>()

const order = ref<Order | null>(null);
const error = ref<string | null>(null);
const isSaving = ref(false);
const isLoading = ref(false);

const router = useRouter();



onMounted(async () => {
  await loadOrder();
});


async function save(data: OrderFormData) {
  try {
    error.value = null;
    isSaving.value = true;
    const result = await updateOrder(props.id, data);
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


async function loadOrder() {
  try {
    isLoading.value = true;
    error.value = null;
    const result = await getOrder(props.id);
    order.value = result;
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