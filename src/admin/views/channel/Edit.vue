<template>
  <v-card color="secondary-bg" height="100vh" flat>

    <!-- {{ { channel } }} -->
    <v-row justify="center" align="center" v-if="isLoading" class="fill-height">
      <v-card width="400px" flat>
        <v-card-subtitle>
          Please wait...
        </v-card-subtitle>
        <v-card-text>
          <v-progress-linear indeterminate />
        </v-card-text>
      </v-card>
    </v-row>

    <v-card flat v-else-if="channel">
      <v-card-text v-if="error">
        <v-alert type="error">
          {{ error }}
        </v-alert>
      </v-card-text>
      <channel-form @save="(data) => save(data)" :channel="channel" :loading="isSaving" />
    </v-card>

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
import ChannelForm from './ChannelForm.vue';
import { onMounted, ref } from 'vue';
import { getChannel, updateChannel, ChannelFormData } from '@/admin/repository/channel/channel_repository';
import Channel from '@/model/channel/channel';
import { useRouter } from 'vue-router';
import { useNotifier } from 'vuetify-notifier';

const props = defineProps<{
  id: string,
}>()

const channel = ref<Channel | null>(null);
const error = ref<string | null>(null);
const isSaving = ref(false);
const isLoading = ref(false);

const router = useRouter();
const notifier = useNotifier();



onMounted(async () => {
  await loadChannel();
});


async function save(data: ChannelFormData) {
  try {
    error.value = null;
    isSaving.value = true;
    const result = await updateChannel(props.id, data);
    notifier.toastSuccess('Channel updated successfully');
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