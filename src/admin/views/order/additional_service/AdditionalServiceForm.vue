<template>
    <v-card color="secondary-bg" height="100vh" flat>
        <!-- <v-card-text> -->

        <v-row justify="center" align="center" class="fill-height">
            <v-card width="500px" flat>
                <v-form ref="form">
                    <v-card-text>
                        <v-text-field v-model="data.code" label="Code" variant="outlined" density="compact"></v-text-field>
                        <v-text-field v-model="data.title" label="Title" variant="outlined"
                            density="compact"></v-text-field>
                        <v-switch v-model="data.enabled" label="Enabled" color="primary" inset></v-switch>
                    </v-card-text>
                    <v-card-actions class="px-5 pb-5">
                        <v-btn @click="save" color="primary" variant="flat" :elevation="0" :loading="loading" block>Save</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-row>
    </v-card>
</template>
<script lang="ts" setup>
import AdditionalService from '@/model/order/additional_service';
import { ChannelFormData } from '@/repository/order/additional_service_repository';
import { defineProps, reactive, ref } from "vue";
import { useConfirm, useSnackbar } from 'vuetify-use-dialog';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const props = defineProps<{
    type?: string;
    service?: AdditionalService;
    loading?: boolean;

}>();


const emit = defineEmits<{
    (e: 'save', data: FormData): void,
}>();

const createConfirm = useConfirm()
const createSnackbar = useSnackbar();

const { xs, smAndDown, mdAndUp } = useDisplay();

const data = reactive<ChannelFormData>({
    code: props.service?.code ?? '',
    title: props.service?.name ?? '',
    enabled: props.service?.enabled?? false,

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