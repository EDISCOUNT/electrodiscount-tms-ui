<template>
    <v-card width="500px" flat>
        <v-form ref="form">

            <v-card-text v-if="error" class="text-center">
                <v-alert type="error" dense>{{ error }}</v-alert>
            </v-card-text>

            <v-card-text>
                <v-text-field v-model="data.code" label="Code" variant="outlined" density="compact" :rules="[
                    (v) => !!v || 'Code is required',
                    (v) => (v && v.length >= 6) || 'Code must be at least 6 characters',

                ]"></v-text-field>
                <v-text-field v-model="data.title" label="Title" variant="outlined" density="compact" :rules="[
                    (v) => !!v || 'Title is required',
                    (v) => (v && v.length <= 50) || 'Title must be less than 50 characters',
                ]"></v-text-field>
                <v-switch v-model="data.enabled" label="Enabled" color="primary" inset></v-switch>
            </v-card-text>
            <v-card-actions class="px-5 pb-5">
                <v-btn @click="save" color="primary" variant="flat" :elevation="0" :loading="loading" block>Save</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>
<script lang="ts" setup>
import { AdditionalServiceFormData } from '@/admin/repository/order/additional_service_repository';
import AdditionalService from '@/model/order/additional_service';
import { defineProps, reactive, ref, watch } from "vue";
// import { useConfirm, useSnackbar } from 'vuetify-use-dialog';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const props = defineProps<{
    type?: string;
    service?: AdditionalService;
    loading?: boolean;
    error?: string,

}>();


const emit = defineEmits<{
    (e: 'save', data: AdditionalServiceFormData): void,
}>();

// const createConfirm = useConfirm()
// const createSnackbar = useSnackbar();

const { xs, smAndDown, mdAndUp } = useDisplay();

const data = reactive<AdditionalServiceFormData>({
    code: props.service?.code ?? '',
    title: props.service?.title ?? '',
    enabled: props.service?.enabled ?? false,

});

const form = ref<VForm>();
const error = ref<string>();

watch(() => props.error, (value) => {
    error.value = value;
});


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
        error.value = text;
        // createSnackbar({ text });
    }
    finally {

    }

}

</script>