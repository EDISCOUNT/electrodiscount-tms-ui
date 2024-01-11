<template>
    <v-card width="800px" flat>
        <v-card-text v-if="error" class="text-center">
            <v-alert type="error" dense>{{ error }}</v-alert>
        </v-card-text>
        <v-form ref="form">
            <v-card-text>
                <v-row>
                    <v-col :cols="12" :md="12">
                        <v-text-field v-model="data.code" label="Code" variant="outlined" density="compact" :rules="[
                            (v) => !!v || 'Code is required',
                            (v) => (v && v.length >= 6) || 'Code must be at least 6 characters',

                        ]"></v-text-field>
                        <v-text-field v-model="data.name" label="Name" variant="outlined" density="compact" :rules="[
                            (v) => !!v || 'Name is required',
                            (v) => (v && v.length <= 255) || 'Name must be less than 255 characters',
                        ]"></v-text-field>
                        <v-switch v-model="data.enabled" label="Enabled" color="primary" inset></v-switch>
                    </v-col>

                    <v-col :cols="12" :md="12">
                        <v-card flat>
                            <v-card-title>
                                Address
                            </v-card-title>
                            <v-card-text>
                                <AddressForm v-model="data.address"/>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="px-5 pb-5">
                <v-btn @click="save" color="primary" variant="flat" :elevation="0" :loading="loading" block>Save</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>
<script lang="ts" setup>
import { StorageFormData } from '@/admin/repository/inventory/storage_repository';
import Storage from '@/model/inventory/storage';
import { defineProps, reactive, ref, watch } from "vue";
// import { useConfirm, useSnackbar } from 'vuetify-use-dialog';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import AddressForm from './partials/AddressForm.vue';

const props = defineProps<{
    type?: string;
    storage?: Storage;
    loading?: boolean;
    error?: string;

}>();


const emit = defineEmits<{
    (e: 'save', data: StorageFormData): void,
}>();

// const createConfirm = useConfirm()
// const createSnackbar = useSnackbar();

const { xs, smAndDown, mdAndUp } = useDisplay();

const data = reactive<StorageFormData>({
    code: props.storage?.code ?? '',
    name: props.storage?.name ?? '',
    address: props.storage?.address?.toJson(),
    enabled: props.storage?.enabled ?? false,

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