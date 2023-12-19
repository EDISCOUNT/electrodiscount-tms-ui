<template>
    <v-card color="secondary-bg" height="100vh" flat>
        <!-- <v-card-text> -->

        <v-row justify="center" align="center" class="fill-height">
            <v-card color="transparent" width="1000px" flat>

                <v-card-text>
                    <v-form ref="form">
                        <v-row justify="space-between">
                            <v-col cols="12" md="7">
                                <v-card flat>
                                    <v-card-title>
                                        <span>Channel</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-form ref="form">
                                            <v-text-field v-model="data.code" label="Code" variant="outlined"
                                                density="compact"></v-text-field>
                                            <v-text-field v-model="data.name" label="Name" variant="outlined"
                                                density="compact"></v-text-field>
                                            <v-text-field v-model="data.shortDescription" label="Short Description"
                                                variant="outlined" density="compact"></v-text-field>
                                            <v-textarea v-model="data.description" label="Description" variant="outlined"
                                                density="compact"></v-textarea>
                                            <v-switch v-model="data.enabled" color="primary" label="Enabled"
                                                inset></v-switch>
                                        </v-form>
                                    </v-card-text>
                                </v-card>
                            </v-col>

                            <v-col cols="12" md="5">
                                <v-card min-height="400px" class="fill-height" flat>
                                    <v-card-title>
                                        <span>Configuration</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <template v-if="data.type == 'app.shipment.sourcing.source.bol_dot_com'">
                                            <v-text-field v-model="data.metadata.client_id" label="Client ID"
                                                variant="outlined" density="compact"></v-text-field>
                                            <v-text-field v-model="data.metadata.client_secret" type="password"
                                                label="Client Secret" variant="outlined" density="compact"></v-text-field>
                                        </template>
                                    </v-card-text>
                                    <v-card-actions class="px-5">
                                        <!-- <v-spacer></v-spacer> -->
                                        <v-btn color="primary" @click="() => save()" variant="flat" :elevation="0"
                                            :loading="loading" block>Save</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-form>

                </v-card-text>
            </v-card>
        </v-row>

        <!-- </v-card-text> -->

    </v-card>
</template>
<script lang="ts" setup>
import Channel from '@/model/channel/channel';
import { ChannelFormData } from '@/repository/channel/channel_repository';
import { defineProps, reactive, ref } from "vue";
import { useConfirm, useSnackbar } from 'vuetify-use-dialog';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const props = defineProps<{
    type?: string;
    channel?: Channel;
    loading?: boolean;

}>();


const emit = defineEmits<{
    (e: 'save', data: FormData): void,
}>();

const createConfirm = useConfirm()
const createSnackbar = useSnackbar();

const { xs, smAndDown, mdAndUp } = useDisplay();

const data = reactive<ChannelFormData>({
    code: props.channel?.code ?? '',
    name: props.channel?.name ?? '',
    shortDescription: props.channel?.shortDescription ?? '',
    description: props.channel?.description ?? '',
    type: props.type ?? props.channel?.type ?? '',
    enabled: props.channel?.enabled?? false,
    metadata: props.channel?.metadata?? {}

});

const form = ref<VForm>();



async function save() {
    try {
        const { valid, errors } = await form.value!.validate();
        if (!valid) {
            throw new Error(errors.toString());
        }
        emit('save', data);
    }
    catch (err) {
        const text = (err as any).message as string;
        createSnackbar({ text });
        // error.value = text;
    }
    finally {

    }

}


</script>