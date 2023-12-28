<template>
  <v-card height="100vh" color="secondary-bg" flat>
    <v-row justify="center" align="center" class="fill-height">
      <v-card flat>
        <v-card-text>
          <user-form @save="(data) => save(data)" :loading="isSaving" />
        </v-card-text>
      </v-card>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import UserForm from './UserForm.vue';
import { UserFormData } from '@/model/account/user';
import { ref } from 'vue';
import { createUser, } from '@/admin/repository/account/user';
import { useRouter } from 'vue-router';



const props = defineProps<{
}>()
const router = useRouter();

const isSaving = ref(false);


async function save(data: UserFormData) {
  try {
    isSaving.value = true;
    const result = await createUser({ input: data});
    router.back();
  }
  catch (err) {

  }
  finally {
    isSaving.value = false;
  }
}
</script>