<template>
    <!-- {{ {modelValue} }} -->
    <VBottomSheet v-model="isOpen" inset location="bottom" max-width="1000px" scrollable>
        <template v-slot:activator="{ props }">
            <slot name="activator" v-bind:prop="props">
                <!-- <v-btn v-bind="props" color="primary" :elevation="0">
                    Edit <v-icon>mdi-pencil</v-icon>
                </v-btn> -->
                <v-text-field v-bind="props" variant="outlined" density="compact"
                    :value="modelValue ? formatAddress(modelValue) : ''" append-inner-icon="mdi-pencil" readonly>

                </v-text-field>
            </slot>
        </template>
        <!-- <v-card min-height="600px" flat>
            <v-card-text class="pa-0"> -->
        <AddressForm @update:model-value="address => updateAddressData(address)" @submit="(data) => save(data)"
            @cancel="() => cancel()" :model-value="modelValue" :submiting="saving">
            <template v-slot:title>
                <v-card-title>
                    <v-layout justify="space-around">
                        <v-icon r-size="x-large" style="font-size: 50px;">mdi-plus-circle</v-icon>
                        <span class="mx-5 mt-2 text-h6 text-lg-h4">Add new Address Book entry</span>
                    </v-layout>
                </v-card-title>
            </template>
            <!-- <template v-slot:action>
                        <v-btn @click="() => save()" :loading="saving" color="primary" variant="flat">
                            <v-icon>mdi-content-save</v-icon>
                            Save
                        </v-btn>
                    </template> -->
        </AddressForm>
        <!-- </v-card-text>
        </v-card> -->
    </VBottomSheet>
</template>

<script lang="ts" setup>
import { formatAddress } from '@/utils/format/address';
import AddressForm from './AddressForm.vue';
import { ref, watch, onMounted, useSlots, useAttrs } from 'vue';
import Address, { AddressFormData } from '@/model/addressing/address';
import { useNotifier } from 'vuetify-notifier';

const attrs = useAttrs();

const props = defineProps<{
    open?: boolean,
    modelValue?: Address | AddressFormData;
}>();

const emit = defineEmits({
    'update:open': null,
    'update:model-value': (data?: AddressFormData) => undefined,
    // created: (address: Address) => undefined,
});
const isOpen = ref(false);

const notifier = useNotifier();


let is_updating = false;

watch(() => props.open, (open) => toggle(open));
// watch(() => props.modelValue, address => {
//     if(is_updating){
//         return;
//     }
//     is_updating = true;
//     if(address instanceof Address){
//         data
//     }
// })
watch(isOpen, (open) => emit('update:open', open));
onMounted(() => {
    if (props.open) {
        toggle(props.open);
    }
});


const saving = ref(false);

async function save(input: { [i: string]: any }) {
    try {
        saving.value = true;
        emit('update:model-value', input);
    }
    catch (err) {
        const text = (err as any).message;
        notifier.toastError({ title: 'An error occured', text });
    }
    finally {
        saving.value = false;
    }
}


function updateAddressData(data: AddressFormData) {
    data = {...(data?? {})};
    emit('update:model-value', data);
    console.log("UPDATING OUTPUT", { data });
}


let isOpen_updateable = true;
function toggle(open?: boolean) {
    if (!isOpen_updateable) {
        return;
    }
    isOpen_updateable = false;
    open ??= !isOpen.value;
    isOpen.value = open;
    setTimeout(() => isOpen_updateable = true, 10);
}

function cancel() {
    close();
}

function close() {
    toggle(false);
}
</script>