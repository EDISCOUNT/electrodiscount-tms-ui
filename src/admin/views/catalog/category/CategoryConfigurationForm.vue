<template>
    <v-card width="500px" flat>
        <v-card-text v-if="error" class="text-center">
            <v-alert type="error" dense>{{ error }}</v-alert>
        </v-card-text>
        <v-card-text>
            <v-card flat>
                <v-card-title>
                    Unit Shipping Cost
                </v-card-title>
                <v-card-text>
                    <MoneyInput v-model="data.defaultUnitShippingPrice" />
                </v-card-text>
            </v-card>
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>
import CategoryConfiguration, { CategoryConfigurationFormData } from '@/model/catalog/category_configuration';
import Category from '@/model/catalog/category';
import { defineProps, reactive, ref, watch } from "vue";
import MoneyInput from '@/components/currency/MoneyInput.vue';
// import { useConfirm, useSnackbar } from 'vuetify-use-dialog';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { useDisplay } from 'vuetify';

const props = defineProps<{
    modelValue?: CategoryConfigurationFormData;
    // 
    type?: string;
    category?: CategoryConfiguration;
    loading?: boolean;
    error?: string;

}>();


const emit = defineEmits<{
    (e: 'save', data: CategoryConfigurationFormData): void,
    (e: 'update:model-value', data?: CategoryConfigurationFormData): void,
}>();

// const createConfirm = useConfirm()
// const createSnackbar = useSnackbar();

const { xs, smAndDown, mdAndUp } = useDisplay();

const data = reactive<CategoryConfigurationFormData>({
    ...props.modelValue,
    // ...props.category?.toJson(),
});
watch(data, (data) => emit('update:model-value', data));

let is_updating_data = false;
watch(
    () => props.modelValue,
    input => {
        if (is_updating_data)
            return;
        is_updating_data = true;
        input ??= {};
        // for(const key in (input)){
        //     const value 
        // }
        setTimeout(() => is_updating_data = false, 100);
    }
)

const form = ref<VForm>();
const error = ref<string>();

watch(() => props.error, (value) => {
    error.value = value;
});




</script>