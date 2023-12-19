<template>
  <v-card flat>
    <channel-form @save="(data) => save(data)" :type="props.type" :loading="isSaving"/>
  </v-card>
</template>

<script lang="ts" setup>
import ChannelForm from './ChannelForm.vue';
import { ref } from 'vue';
import { createChannel, ChannelFormData } from '@/admin/repository/channel/channel_repository';

const props = defineProps<{
    type: string,
}>()


const isSaving = ref(false);


async function save(data: ChannelFormData){
  try{
    isSaving.value = true;
    const result = await createChannel(data);

  }
  catch(err){

  }
  finally{
    isSaving.value = false;
  }
}
</script>