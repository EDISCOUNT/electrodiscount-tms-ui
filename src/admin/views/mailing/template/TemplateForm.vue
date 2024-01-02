<template>
    <v-card width="1400px" flat>
        <v-card-text v-if="error" class="text-center">
            <v-alert type="error" dense>{{ error }}</v-alert>
        </v-card-text>
        <v-form ref="form">
            <v-card-text>
                <v-row>
                    <v-col :cols="12" :md="6">
                        <v-text-field v-model="data.label" label="Label" variant="outlined" density="compact" :rules="[

                        ]"></v-text-field>

                        <v-text-field v-model="data.subject" label="EMail Subject" variant="outlined" density="compact" :rules="[
                            // (v) => !!v || 'EAN is required',
                        ]"></v-text-field>
                   
                        <v-switch v-model="data.enabled" label="Enabled" color="primary" inset></v-switch>
                        <v-card-actions class="px-5 pb-5">
                            <v-btn @click="save" color="primary" variant="flat" :elevation="0" :loading="loading"
                                block>Save</v-btn>
                        </v-card-actions>
                    </v-col>

                    <v-col :cols="12" :md="6">
                        <EmailForm v-model="data.message" />
                    </v-col>
                </v-row>

            </v-card-text>

        </v-form>
    </v-card>
</template>
<script lang="ts" setup>
import {  } from '@/repository/mailing/template_repository';
import EmailMessageTemplate, { EmailMessageTemplateFormData } from '@/model/mailing/message_template';
import EmailForm from '@/views/mailing/email/EmailForm.vue';
import { defineProps, reactive, ref, watch } from "vue";
// import { useConfirm, useSnackbar } from 'vuetify-use-dialog';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { useDisplay } from 'vuetify';

const props = defineProps<{
    type?: string;
    template?: EmailMessageTemplate;
    loading?: boolean;
    error?: string;

}>();


const emit = defineEmits<{
    (e: 'save', data: EmailMessageTemplateFormData): void,
}>();

// const createConfirm = useConfirm()
// const createSnackbar = useSnackbar();

const { xs, smAndDown, mdAndUp } = useDisplay();

const data = reactive<EmailMessageTemplateFormData>({
    label: props.template?.label ?? '',
    subject: props.template?.subject ?? '',
    message: props.template?.message ?? '',
    enabled: props.template?.enabled ?? false,

});

const form = ref<VForm>();
const error = ref<string>();

watch(() => props.error, (value) => {
    error.value = value;
});


async function save() {
    try {
        error.value = undefined;
        const { valid, errors } = await form.value!.validate();
        if (!valid) {
            throw new Error(errors.toString());
        }
        emit('save', data);
    }
    catch (err) {
        const text = (err as any).message as string;
        error.value = text;
        // createSnackbar({ text });
    }
    finally {

    }

}


</script>