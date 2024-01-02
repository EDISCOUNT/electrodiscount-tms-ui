<template>
  <v-card height="100vh" r-color="secondary-bg" flat>
    <v-row justify="center" align="center" class="fill-height">
      <v-card flat>
        <v-card-text>
          <template-form @save="(data) => save(data)" :loading="isSaving" />
        </v-card-text>
      </v-card>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import TemplateForm from './TemplateForm.vue';
import { ref } from 'vue';
import { createEmailMessageTemplate } from '@/repository/mailing/template_repository';
import { EmailMessageTemplateFormData } from '@/model/mailing/message_template';
import { useRouter } from 'vue-router';



const props = defineProps<{
}>()
const router = useRouter();

const isSaving = ref(false);


async function save(data: EmailMessageTemplateFormData) {
  try {
    isSaving.value = true;
    const result = await createEmailMessageTemplate(data);
    router.back();
  }
  catch (err) {

  }
  finally {
    isSaving.value = false;
  }
}
</script>