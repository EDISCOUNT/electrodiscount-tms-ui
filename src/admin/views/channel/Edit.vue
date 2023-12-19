<template>
  <v-card flat>
    <v-card v-if="isLoading" flat>
      <v-card-subtitle>
        Please wait...
      </v-card-subtitle>
    </v-card>

    <v-card flat v-else-if="channel">
      <v-card-text v-if="error">
        <v-alert type="error">
          {{ error }}
        </v-alert>
      </v-card-text>
      <channel-form @save="(data) => save(data)" :channel="channel" :loading="isSaving" />
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
import ChannelForm from './ChannelForm.vue';
import { onMounted, ref } from 'vue';
import { getChannel, updateChannel, ChannelFormData } from '@/admin/repository/channel/channel_repository';
import Channel from '@/model/channel/channel';
import { useRouter } from 'vue-router';

const props = defineProps<{
  id: string,
}>()

const channel = ref<Channel | null>(null);
const error = ref<string | null>(null);
const isSaving = ref(false);
const isLoading = ref(false);

const router = useRouter();



onMounted(async () => {
  await loadChannel();
});


async function save(data: ChannelFormData) {
  try {
    error.value = null;
    isSaving.value = true;
    const result = await updateChannel(props.id, data);
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


async function loadChannel() {
  try {
    isLoading.value = true;
    error.value = null;
    const result = await getChannel(props.id);
    channel.value = result;
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