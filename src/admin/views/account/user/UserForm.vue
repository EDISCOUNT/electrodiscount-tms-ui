<template>
    <v-card width="600px" flat>
        <v-card-text v-if="error" class="text-center">
            <v-alert type="error" dense>{{ error }}</v-alert>
        </v-card-text>
        <v-form ref="form">
            <v-card-text>
                <v-row>
                    <v-col :cols="12" :md="6">
                        <v-text-field v-model="data.firstName" label="First name" placeholder="Enter firstname"
                            variant="outlined" density="compact" :rules="[
                                (v) => !!v || 'First Name is required',
                                (v) => (v && v.length >= 3) || 'First Name must be at least 6 characters',
                            ]"></v-text-field>
                    </v-col>

                    <v-col :cols="12" :md="6">
                        <v-text-field v-model="data.lastName" label="Last Name" variant="outlined" density="compact" :rules="[
                            // (v) => !!v || 'EAN is required',
                            // (v) => (v && v.length <= 14) || 'Last Name must be less than or equal to 14 characters',
                        ]"></v-text-field>
                    </v-col>

                    <v-col :cols="12" :md="6">
                        <v-text-field v-model="data.email" label="E-Mail Address" variant="outlined"
                            density="compact" :rules="[
                                (v) => !!v || 'Email Address is required',
                                (v) => (v && v.length <= 64) || 'EMail must be less than 255 characters',
                            ]"></v-text-field>
                    </v-col>

                    <v-col :cols="12" :md="6">
                        <v-text-field v-model="data.phone" label="Phone Number" variant="outlined" density="compact" :rules="[
                            (v) => !!v || 'Phone Number is required',
                            (v) => (v && v.length <= 64) || 'Phone must be less than 255 characters',
                        ]"></v-text-field>
                    </v-col>


                    <v-col :cols="12" :md="6">
                        <v-text-field v-model="data.username" label="Username" variant="outlined" density="compact"
                            type="text" :rules="[
                                (v) => !!v || 'Username is required',
                                (v) => (v && v.length >= 5) || 'Username must be at least 5 characters',
                            ]"></v-text-field>
                    </v-col>

                    <v-col :cols="12" :md="6">
                        <v-text-field v-model="data.password" label="Password" variant="outlined" density="compact"
                            type="password" :rules="[
                                (v) => !!v || 'Password is required',
                                (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
                            ]"></v-text-field>
                    </v-col>

                    <v-col :cols="12" :md="12">
                        <v-combobox v-model="data.roles" label="Roles" variant="outlined" density="compact"
                        :items="roles"
                        :rules="[
                            ]" multiple></v-combobox>
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
import User, { UserFormData } from '@/model/account/user';
import { defineProps, reactive, ref, watch } from "vue";
// import { useConfirm, useSnackbar } from 'vuetify-use-dialog';
import { VForm } from 'vuetify/lib/components/index.mjs';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const props = defineProps<{
    type?: string;
    user?: User;
    loading?: boolean;
    error?: string;

}>();


const emit = defineEmits<{
    (e: 'save', data: UserFormData): void,
}>();

// const createConfirm = useConfirm()
// const createSnackbar = useSnackbar();

const { xs, smAndDown, mdAndUp } = useDisplay();

console.log("PROPS: ", {...props});

const data = reactive<UserFormData>(props.user?.toJson()?? {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    roles:[ ],
});

const form = ref<VForm>();
const error = ref<string>();

// const


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




const roles = [
    'ROLE_ADMIN',
    'ROLE_USER',
    'ROLE_SUPER_ADMIN',
    'ROLE_MANAGER',
];
</script>