<template>
    <v-card width="800px" flat>
        <v-card-text v-if="error" class="text-center">
            <v-alert type="error" dense>{{ error }}</v-alert>
        </v-card-text>
        <v-form ref="form">
            <v-card-text>
                <v-row>
                    <v-col :cols="8">
                        <v-text-field v-model="data.code" label="Code" variant="outlined" density="compact" :rules="[
                            required(),
                            length({ min: 6 }),

                        ]"></v-text-field>
                        <v-text-field v-model="data.name" label="Name" variant="outlined" density="compact" :rules="[
                            required(),
                            length({ max: 50 }),
                        ]"></v-text-field>

                        <v-text-field v-model="data.emailAddress" label="EMail Address" type="email" variant="outlined"
                            density="compact" :rules="[
                                required(),
                                // length({ max: 50 }),
                                email(),
                            ]"></v-text-field>

                        <v-text-field v-model="data.phoneNumber" label="Phone Number" type="tel" variant="outlined"
                            density="compact" :rules="[
                                required(),
                                length({ max: 50 }),
                            ]"></v-text-field>

                        <v-card flat>
                            <v-card-text class="pa-0">
                                <CarrierUserOperatorInput v-model="data.operatorUser" variant="outlined" density="compact"
                                    label="Operator User Account" clearable />
                            </v-card-text>
                        </v-card>
                        <v-switch v-model="data.enabled" label="Enabled" color="primary" inset></v-switch>
                    </v-col>

                    <v-col :cols="4">
                        <v-card flat>
                            <v-card-title>
                                Carrier Logo
                            </v-card-title>
                            <v-card-text>
                                <CarrierLogoInput v-model="data.logoImage" :uploading="uploading"/>
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
import { CarrierFormData } from '@/admin/repository/carrier/carrier_repository';
import Carrier, { CarrierLogoData } from '@/model/carrier/carrier';
import { defineProps, reactive, ref, watch } from "vue";
// import { useConfirm, useSnackbar } from 'vuetify-use-dialog';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import CarrierUserOperatorInput from './partials/CarrierUserOperatorInput.vue';
import { email, required, length } from '@/common/form/validation';
import CarrierLogoInput from './partials/CarrierLogoInput.vue';

const props = defineProps<{
    type?: string;
    carrier?: Carrier;
    loading?: boolean;
    uploading?: boolean;
    error?: string;

}>();


const emit = defineEmits<{
    (e: 'save', data: CarrierFormData): void,
    (e: 'update:logo', image?: CarrierLogoData): void,
}>();

// const createConfirm = useConfirm()
// const createSnackbar = useSnackbar();

const { xs, smAndDown, mdAndUp } = useDisplay();

const data = reactive<CarrierFormData>({
    code: props.carrier?.code ?? '',
    name: props.carrier?.name ?? '',
    emailAddress: props.carrier?.emailAddress,
    phoneNumber: props.carrier?.phoneNumber,
    enabled: props.carrier?.enabled ?? false,
    operatorUser: props.carrier?.operatorUser?.id,
    logoImage: props.carrier?.logoImage,
});

const form = ref<VForm>();
const error = ref<string>();

watch(() => props.error, (value) => {
    error.value = value;
});


// 
watch(() => data.logoImage, (image) => {
    emit('update:logo', image as any);
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