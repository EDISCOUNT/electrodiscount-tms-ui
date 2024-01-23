<template>
    <v-card width="700px" flat>
        <v-card-text v-if="error" class="text-center">
            <v-alert type="error" dense>{{ error }}</v-alert>
        </v-card-text>
        <v-form ref="form">
            <v-card-text>
                <v-text-field v-model="data.code" label="Code" variant="outlined" density="compact" :rules="[
                    (v) => !!v || 'Code is required',
                    (v) => (v && v.length >= 6) || 'Code must be at least 6 characters',

                ]"></v-text-field>
                <v-text-field v-model="data.name" label="Name" variant="outlined" density="compact" :rules="[
                    (v) => !!v || 'Name is required',
                    (v) => (v && v.length <= 255) || 'Name must be less than 255 characters',
                ]"></v-text-field>
                <v-switch v-model="data.enabled" label="Enabled" color="primary" inset></v-switch>
            </v-card-text>
            <v-card-text>
                <v-tabs v-model="tab">
                    <v-tab value="config">
                        Configuration
                    </v-tab>
                </v-tabs>

                <v-window v-model="tab">
                    <v-window-item value="config">
                        <category-configuration-form v-model="data.configuration" />
                    </v-window-item>
                </v-window>
            </v-card-text>
            <v-card-actions class="px-5 pb-5">
                <v-btn @click="save" color="primary" variant="flat" :elevation="0" :loading="loading" block>Save</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>
<script lang="ts" setup>
import { CategoryFormData } from '@/admin/repository/catalog/category_repository';
import Category from '@/model/catalog/category';
import { defineProps, reactive, ref, watch } from "vue";
// import { useConfirm, useSnackbar } from 'vuetify-use-dialog';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import CategoryConfigurationForm from './CategoryConfigurationForm.vue';

const props = defineProps<{
    type?: string;
    category?: Category;
    loading?: boolean;
    error?: string;

}>();


const emit = defineEmits<{
    (e: 'save', data: CategoryFormData): void,
}>();

// const createConfirm = useConfirm()
// const createSnackbar = useSnackbar();

const { xs, smAndDown, mdAndUp } = useDisplay();

const data = reactive<CategoryFormData>({
    ...(props.category?.toJson())
});

const tab = ref<string>();
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