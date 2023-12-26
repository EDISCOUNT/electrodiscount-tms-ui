<template>
    <v-card :height="height" flat>
        <slot v-if="smAndDown" name="title"></slot>
        <v-card-text>
            <v-card width="100%" v-if="smAndDown" color="grey-lighten-4" flat>
                <address-coordinate-map-input @update:coordinate="coords => onUpdateCoordinate(coords)"
                    v-model:coordinate="addressInfo.coordinate" :height="'200px'" />
            </v-card>
            <v-divider v-if="smAndDown" class="mt-4"/>
            <v-form ref="form" @submit.prevent="() => submit()" class="pt-2">
                <v-row>
                    <v-col :cols="12" :md="showMap? 7 : 12">
                        <v-card flat>
                            <slot v-if="mdAndUp" name="title"></slot>
                            <v-card-text v-if="error">
                                <v-alert type="error" @click:close="() => clearError()" closable>
                                    {{ error }}
                                </v-alert>
                            </v-card-text>
                            <v-card-text>
                                <v-card-subtitle class="pb-3 text-h6">
                                    Personal Information
                                </v-card-subtitle>
                                <v-row>
                                    <v-col :cols="12" :md="6">
                                        <v-text-field v-model="addressInfo.firstName" label="First Name"
                                            placeholder="Enter Firstname" variant="outlined" density="compact" :rules="[
                                                v => !!v || 'Field is required',
                                            ]" />
                                    </v-col>
                                    <v-col :cols="12" :md="6">
                                        <v-text-field v-model="addressInfo.lastName" label="Last Name"
                                            placeholder="Enter Lastname" variant="outlined" density="compact" :rules="[
                                                v => !!v || 'Field is required',
                                            ]" />
                                    </v-col>

                                    <v-col :cols="12" :md="6">
                                        <v-text-field v-model="addressInfo.emailAddress" label="Email address"
                                            placeholder="Enter email address" variant="outlined" density="compact" :rules="[
                                                v => !!v || 'Field is required',
                                            ]" />
                                    </v-col>
                                    <v-col :cols="12" :md="6">
                                        <v-text-field v-model="addressInfo.phoneNumber" label="Phone Number"
                                            placeholder="Enter phone number" variant="outlined" density="compact" :rules="[
                                                v => !!v || 'Field is required',
                                            ]" />
                                    </v-col>
                                </v-row>
                                <v-divider class="mb-4" />
                                <v-card-subtitle class="pb-3 text-h6">
                                    Address Information
                                </v-card-subtitle>

                                <v-row>

                                    <v-col :cols="12" :md="6">
                                        <v-text-field v-model="addressInfo.company" label="Company"
                                            placeholder="Enter company or place name" variant="outlined" density="compact"
                                            :rules="[
                                                v => !!v || 'Field is required',
                                            ]" />
                                    </v-col>

                                    <v-col :cols="12" :md="6">
                                        <v-text-field v-model="addressInfo.street" label="Street Address"
                                            placeholder="Enter street" variant="outlined" density="compact" :rules="[
                                                v => !!v || 'Field is required',
                                            ]" />
                                    </v-col>



                                    <v-col :cols="12" :md="6">
                                        <v-text-field v-model="addressInfo.city" label="City/Town"
                                            placeholder="Enter city or town name" variant="outlined" density="compact"
                                            :rules="[
                                                v => !!v || 'Field is required',
                                            ]" />
                                    </v-col>

                                    <v-col :cols="12" :md="6">
                                        <v-text-field v-model="addressInfo.provinceCode" label="State/Province Code"
                                            placeholder="Enter State or Province Code" variant="outlined" density="compact"
                                            :rules="[
                                                v => !!v || 'Field is required',
                                            ]" />
                                    </v-col>
                                    <v-col :cols="12" :md="6">
                                        <v-text-field v-model="addressInfo.postcode" label="Postcode/Zipcode"
                                            placeholder="Enter postcode" variant="outlined" density="compact" :rules="[
                                                v => !!v || 'Field is required',
                                            ]" />
                                    </v-col>
                                    <v-col :cols="12" :md="6">
                                        <v-autocomplete v-model="addressInfo.countryCode" :items="countries"
                                            item-title="name" item-value="code" label="Country" placeholder="Select country"
                                            variant="outlined" density="compact" :rules="[
                                                v => !!v || 'Field is required',
                                            ]" clearable />
                                    </v-col>

                                </v-row>
                            </v-card-text>

                            <v-card-text r-v-if="slots?.action">
                                <slot name="action">
                                    <v-btn @click="() => submit()" :loading="submiting" color="primary" variant="flat">
                                        <v-icon>mdi-content-save</v-icon>
                                        Save
                                    </v-btn>

                                    <v-btn @click="() => cancel()" :disabled="submiting" color="primary" class="mx-2"
                                        variant="outlined">
                                        <v-icon>mdi-cancel</v-icon>
                                        Cancel
                                    </v-btn>
                                </slot>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col v-if="showMap" :cols="12" :md="5">
                        <v-card width="100%" v-if="showMap && mdAndUp" :height="height" color="grey-lighten-4" flat>
                            <address-coordinate-map-input @update:coordinate="coords => onUpdateCoordinate(coords)"
                                v-model:coordinate="addressInfo.coordinate" :height="height" />
                        </v-card>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>
import Address from '@/model/addressing/address';
import { ref } from 'vue';
import { computed } from 'vue';
import { watch } from 'vue';
import { onMounted } from 'vue';
import { reactive, useSlots } from 'vue';
// import { useConfirm, useSnackbar } from 'vuetify-use-dialog';
import AddressCoordinateMapInput from './AddressCoordinateMapInput.vue';
import Coords from '@/model/addressing/coordinate';
import { getCountries } from '@/utils/intl';
import { useDisplay } from 'vuetify';

const USER_INFO = {
    firstName: undefined as string | undefined,
    lastName: undefined as string | undefined,
    emailAddress: undefined as string | undefined,
    phoneNumber: undefined as string | undefined,
    company: undefined as string | undefined,
    street: undefined as string | undefined,
    postcode: undefined as string | undefined,
    city: undefined as string | undefined,
    provinceCode: undefined as string | undefined,
    provinceName: undefined as string | undefined,
    countryCode: undefined as string | undefined,
    coordinate: undefined as Coords | undefined,
};

const props = defineProps({
    address: {
        type: Address,
        required: false,
    },
    submiting: {
        type: Boolean,
        required: false,
    },
    height: {
        type: [String, Number],
        required: false,
    },
    showMap: {
        type: Boolean,
        required: false,
        default: false,
    },
});
const emit = defineEmits(['submit', 'cancel'])

// const createConfirm = useConfirm()
// const createSnackbar = useSnackbar();

const { xs, smAndDown, mdAndUp } = useDisplay();


const countries = getCountries();

const error = ref<string>();

const form = ref();

const addressInfo = reactive(USER_INFO);

watch(() => props.address, (address) => updateData(address));
onMounted(() => updateData(props.address));


const height = computed(() => {
    if (props.height)
        return props.height;
    return '630px';
});

const showMap = computed(() => {
    if (props.showMap)
        return props.showMap;
    return false;
});

async function submit() {
    try {
        clearError()
        const { valid, error } = await (form.value as any).validate();
        if (!valid) {
            throw new Error("Form not valid");
        }
        emit('submit', addressInfo);
    }
    catch (err) {
        const text = (err as any).message as string;
        // createSnackbar({ text });
        error.value = text;
    }
    finally {

    }
}



function onUpdateCoordinate(coords: any) {
    // console.log('COORDS: ', coords);
}

function clearError() {
    error.value = undefined;
}


function cancel() {
    emit('cancel');
}

function updateData(address?: Address) {
    if (!address) {
        for (const key in USER_INFO) {
            const value = (USER_INFO as any)[key];
            (addressInfo as any)[key] = value;
        }
        return;
    }

    addressInfo.firstName = address.firstName;
    addressInfo.lastName = address.lastName;
    addressInfo.phoneNumber = address.phoneNumber;
    addressInfo.emailAddress = address.emailAddress;
    //
    addressInfo.company = address.company;
    addressInfo.street = address.street;
    addressInfo.postcode = address.postcode;
    addressInfo.city = address.city;
    addressInfo.provinceCode = address.provinceCode;
    addressInfo.provinceName = address.provinceName;
    addressInfo.countryCode = address.countryCode;
    addressInfo.coordinate = Coords.fromJson(address.coordinates?.toJson());

}
</script>